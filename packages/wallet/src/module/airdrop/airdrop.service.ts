import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { $asyncAllNoNullMap, Logger, InternalChainName, AIRDROP_TYPE, AIRDROP_ORDER_STATE_ID, ChainHelper, CHAIN_NETWORK_TYPE } from "@bnqkl/wallet-sdk";
import { AirdropRecordsReqDto, AirdropReqDto } from "./dto";
import { AirdropOrderRepository, AirdropTransferTxRepository } from "./airdrop.repository";
import { AirdropOrder, AirdropTransferTx, ORDER_TYPE } from "../../common";
import { AirdropHelper, FileHelper, internalChainHelper, OrderHelper } from "../../helper";
import { InternalChainTransMgr } from "../internal-chain-trans/internal-chain-trans-mgr";
import { DataSource, QueryRunner } from "typeorm";
import { staticConfig } from "../../config";

@Injectable()
export class AirdropService {
    @Inject(forwardRef(() => DataSource))
    private __dataSource: DataSource;
    @Inject(forwardRef(() => AirdropOrderRepository))
    protected __airdropOrderRepository!: AirdropOrderRepository;
    @Inject(forwardRef(() => AirdropTransferTxRepository))
    protected __airdropTransferTxRepository!: AirdropTransferTxRepository;
    @Inject(forwardRef(() => InternalChainTransMgr))
    private __internalChainTransMgr!: InternalChainTransMgr;

    private __orderType = ORDER_TYPE.AIRDROP;

    /**
     * 空投
     * @param dto
     * @param file
     * @returns
     */
    async airdrop(dto: AirdropReqDto, file?: Express.Multer.File): Promise<WalletTypings.Airdrop.Api.AirdropResDto> {
        if (file) {
            const blobUrl = FileHelper.saveBlobFile(file);
            dto.issueDpInfo.remark.pic = blobUrl;
        }
        // 验证空投参数
        await this.__verifyAirdropParam(dto);
        return await this.__doAirdrop(dto);
    }

    /**
     * 验证空投参数
     * @param dto
     */
    private async __verifyAirdropParam(dto: AirdropReqDto) {
        const { chainName, airdropType, issueDpInfo, transferDpInfos } = dto;
        // const airdrop = await this.__globalValueRedisRepository.getConfigByKeyForce("airdrop");
        const mainAssetType = ChainHelper.getInternalMainAssetType(chainName, staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET);
        if (airdropType === AIRDROP_TYPE.NORMAL) {
            if (transferDpInfos.length > 1) {
                throw Error(`NORMAL airdrop transferDpInfos.length > 1`);
            }
        } else if (airdropType === AIRDROP_TYPE.LIMITED) {
            if (!issueDpInfo.quantity) {
                throw Error(`LIMITED airdrop issueDpInfo.quantity is undefined`);
            }
        }
        await $asyncAllNoNullMap(transferDpInfos, async ({ address, dpNo }) => {
            if (!(await internalChainHelper.isBCFAddress(address))) {
                throw Error(`address:${address} is not BCF address`);
            }
            if (airdropType === AIRDROP_TYPE.LIMITED && !dpNo) {
                throw Error(`LIMITED airdrop address:${address} dpNo is undefined`);
            }
        });
    }

    private async __doAirdrop(dto: AirdropReqDto) {
        const { airdropType, transferDpInfos } = dto;
        const qr = this.__dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            // 创建订单
            const order = await this.__createAirdropOrder(qr, dto);
            if (airdropType === AIRDROP_TYPE.LIMITED) {
                // 限量集，批量创建转移交易
                await this.__multiCreateTransferTx(qr, order.entityId, transferDpInfos);
            }
            await qr.commitTransaction();
            return { orderId: order.entityId };
        } catch (error) {
            await qr.rollbackTransaction();
            throw error;
        } finally {
            await qr.release();
        }
    }

    /**
     * 创建空投订单
     * @param qr
     * @param dto
     * @returns
     */
    protected async __createAirdropOrder(qr: QueryRunner, dto: AirdropReqDto) {
        const { mqId, airdropType, chainName, issueDpInfo, transferDpInfos } = dto;
        const order = new AirdropOrder();
        order.state = AIRDROP_ORDER_STATE_ID.INIT;
        order.mqId = mqId;
        order.type = airdropType;
        order.chainName = chainName;
        order.issueDpInfo = issueDpInfo;
        // issueTxId先用entityId保证唯一索引
        order.issueTxId = order.entityId;
        if (airdropType === AIRDROP_TYPE.NORMAL) {
            order.transferAddress = transferDpInfos[0].address;
        }
        // transferTxId先用entityId保证唯一索引
        order.transferTxId = order.entityId;
        await qr.manager.insert(AirdropOrder, order);
        return order;
    }

    /**
     * 批量创建空投转移交易
     * @param qr
     * @param orderId
     * @param transferDpInfos
     * @returns
     */
    private async __multiCreateTransferTx(qr: QueryRunner, orderId: string, transferDpInfos: WalletTypings.Airdrop.TransferDpInfo[]) {
        const txArray = await $asyncAllNoNullMap(transferDpInfos, async ({ address, dpNo }) => {
            if (!dpNo) {
                return;
            }
            const transferTx = new AirdropTransferTx();
            transferTx.orderId = orderId;
            transferTx.dpNo = dpNo;
            transferTx.address = address;
            // transferTxId先用entityId保证唯一索引
            transferTx.transferTxId = AirdropHelper.genDefaultTransferTxId(orderId, dpNo);
            return transferTx;
        });
        await qr.manager.insert(AirdropTransferTx, txArray);
    }

    /**
     * 空投订单重试发行交易上链
     * @param orderId
     */
    async retryIssueTxOnChain(orderId: string) {
        await this.__airdropOrderRepository.findOneByForce({
            entityId: orderId,
            state: AIRDROP_ORDER_STATE_ID.ISSUE_TX_ON_CHAIN_FAIL,
        });
        const { affected } = await this.__airdropOrderRepository.update(
            { entityId: orderId, state: AIRDROP_ORDER_STATE_ID.ISSUE_TX_ON_CHAIN_FAIL },
            { state: AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN },
        );
        if (!affected) {
            throw Error(
                `<${this.__orderType}> update orderId:${orderId} state:${AIRDROP_ORDER_STATE_ID.ISSUE_TX_ON_CHAIN_FAIL} to state:${AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN} fail`,
            );
        }
        await OrderHelper.createAirdropOrderObj(orderId);
        return true;
    }

    /**
     * 空投订单重试转移交易上链
     * @param orderId
     * @param authorization
     */
    async retryTransferTxOnChain(orderId: string) {
        await this.__airdropOrderRepository.findOneByForce({
            entityId: orderId,
            state: AIRDROP_ORDER_STATE_ID.TRANSFER_TX_ON_CHAIN_FAIL,
        });
        const { affected } = await this.__airdropOrderRepository.update(
            { entityId: orderId, state: AIRDROP_ORDER_STATE_ID.TRANSFER_TX_ON_CHAIN_FAIL },
            { state: AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN },
        );
        if (!affected) {
            throw Error(
                `<${this.__orderType}> update orderId:${orderId} state:${AIRDROP_ORDER_STATE_ID.TRANSFER_TX_ON_CHAIN_FAIL} to state:${AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN} fail`,
            );
        }
        await OrderHelper.createAirdropOrderObj(orderId);
        return true;
    }

    /**
     * 获取空投记录列表
     * @param authorization
     * @param dto
     */
    async getRecords(dto: AirdropRecordsReqDto): Promise<WalletTypings.Airdrop.Api.AirdropRecordsResDto> {
        const { airdropType, chainName, address, page, pageSize } = dto;
        const result = await this.__airdropOrderRepository.findByPage(
            { where: { chainName, transferAddress: address, type: airdropType }, order: { id: "DESC" } },
            page,
            pageSize,
        );
        const realDataList = await $asyncAllNoNullMap(result.dataList, async ({ entityId, type, state, chainName, issueTxId, transferTxId, createdTime }) => {
            let transferTxIds: string[] = [];
            if (type === AIRDROP_TYPE.NORMAL) {
                transferTxIds = [transferTxId];
            } else if (type === AIRDROP_TYPE.LIMITED) {
                const transferTxArray = await this.__airdropTransferTxRepository.findBy({ orderId: entityId });
                transferTxIds = transferTxArray.map((v) => v.transferTxId);
            }
            const record: WalletTypings.Airdrop.AirdropRecord = {
                orderId: entityId,
                state: OrderHelper.getAirdropRecordState(state),
                orderState: state,
                chainName,
                issueTxId,
                transferTxIds,
                createdTime,
            };
            return record;
        });
        const pageData = result.replaceDataList(realDataList);
        return pageData;
    }

    /**
     * 获取空投记录详情
     * @param authorization
     * @param orderId
     * @returns
     */
    async getRecordDetail(orderId: string): Promise<WalletTypings.Airdrop.Api.AirdropRecordDetailResDto> {
        const { type, state, chainName, issueTxId, transferAddress, transferTxId, updatedTime } = await this.__airdropOrderRepository.findOneByForce({
            entityId: orderId,
        });
        const { senderId, txHash, failReason, feeInfo } = await this.getTxInfo(chainName, issueTxId);
        const issueTxInfo: WalletTypings.Order.RecordDetailTxInfo = {
            chainName,
            address: senderId,
            txId: issueTxId,
            txHash,
            feeInfo,
        };
        // 订单失败原因
        let orderFailReason = failReason;
        let transferTxInfos: WalletTypings.Order.RecordDetailTxInfo[] = [];
        if (type === AIRDROP_TYPE.NORMAL) {
            const transferTxInfo: WalletTypings.Order.RecordDetailTxInfo = { chainName, address: transferAddress };
            if (transferTxId !== orderId) {
                const { txHash, failReason, feeInfo } = await this.getTxInfo(chainName, transferTxId);
                transferTxInfo.txId = transferTxId;
                transferTxInfo.txHash = txHash;
                transferTxInfo.feeInfo = feeInfo;
                orderFailReason = failReason;
            }
            transferTxInfos = [transferTxInfo];
        } else if (type === AIRDROP_TYPE.LIMITED) {
            const transferTxArray = await this.__airdropTransferTxRepository.findBy({ orderId });
            transferTxInfos = await $asyncAllNoNullMap(transferTxArray, async ({ dpNo, address, transferTxId }) => {
                const transferTxInfo: WalletTypings.Order.RecordDetailTxInfo = { chainName, address };
                if (transferTxId !== AirdropHelper.genDefaultTransferTxId(orderId, dpNo)) {
                    const { txHash, failReason, feeInfo } = await this.getTxInfo(chainName, transferTxId);
                    transferTxInfo.txId = transferTxId;
                    transferTxInfo.txHash = txHash;
                    transferTxInfo.feeInfo = feeInfo;
                    orderFailReason = failReason;
                }
                return transferTxInfo;
            });
        }
        const detail: WalletTypings.Airdrop.Api.AirdropRecordDetailResDto = {
            state: OrderHelper.getAirdropRecordState(state),
            orderState: state,
            issueTxInfo,
            transferTxInfos,
            orderFailReason,
            updatedTime,
        };
        return detail;
    }

    /**
     * 获取交易信息
     * @param chainName
     * @param txId
     * @returns
     */
    async getTxInfo(
        chainName: InternalChainName,
        txId: string,
    ): Promise<{ senderId: string; recipientId?: string; txHash: string; failReason?: string; feeInfo?: WalletTypings.TransFeeInfo }> {
        const { senderId, recipientId, signature, trJson, failReason } = await this.__internalChainTransMgr.getTrans({ chainName, txId });
        return {
            senderId,
            recipientId,
            txHash: signature,
            failReason,
            feeInfo: { fee: trJson.fee },
        };
    }
}
