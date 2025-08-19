import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
    sleep,
    Logger,
    AIRDROP_ORDER_STATE_ID,
    INTERNAL_TRANS_RETRY_INVERVAL,
    COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY,
    $asyncAllNoNullMap,
    AIRDROP_TYPE,
} from "@bnqkl/wallet-sdk";
import type { AirdropOrderObj } from "../../airdrop-order-obj.js";
import { AirdropOrderPendingState } from "../airdrop-order-pending.state.js";
import { LOCAL_MQ_ID, TRANSACTION_LINK_TYPE } from "../../../../../common/index.js";
import { AirdropHelper } from "../../../../../helper/index.js";
import { walletPublisher } from "../../../../mq/index.js";

/**转移交易等待上链状态 */
@Injectable()
export class TransferTxWaitOnChain_AirdropOrderState extends AirdropOrderPendingState {
    constructor() {
        super(AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN);
    }

    /**
     * 心跳
     * @param orderObj
     */
    async onTick(orderObj: AirdropOrderObj): Promise<void> {
        // 重试转移交易
        for (const transferTxObj of orderObj.pendingTransferTxObjMap.values()) {
            if (transferTxObj.retryTransferTxStamp && Date.now() >= transferTxObj.retryTransferTxStamp) {
                transferTxObj.retryTransferTxStamp = undefined;
                await walletPublisher.publishCommonOrderEvent(
                    COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_TRANSFER_TX_START,
                    { orderId: orderObj.orderId, params: { transferDpTxId: transferTxObj.transferTxId } },
                    undefined,
                    true,
                );
            }
        }
    }

    /**
     * 进入状态
     * @param orderObj
     */
    async onEnterState(orderObj: AirdropOrderObj): Promise<void> {
        const { orderId } = orderObj;
        // 等待mq内链上链相关队列初始化完毕
        this.__memoryService.waitInternalOnChainQueueInited().then(async () => {
            if (orderObj.curStateId !== AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN) {
                // 已更新到最新高度，但state已经不是TRANSFER_TX_WAIT_ON_CHAIN，说明同步完成后本订单已经处理过，直接跳过本状态
                return;
            }
            await walletPublisher.publishCommonOrderEvent(COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ENTER_TRANSFER_STATE, { orderId }, undefined, true);
        });
    }

    /**
     * 进入转移状态回调
     * @param orderObj
     */
    async onEnterTransferStateCallback(orderObj: AirdropOrderObj): Promise<void> {
        await $asyncAllNoNullMap(Array.from(orderObj.pendingTransferTxObjMap.values()), async ({ transferTxId }) => {
            await walletPublisher.publishCommonOrderEvent(
                COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_TRANSFER_TX_START,
                { orderId: orderObj.orderId, params: { transferDpTxId: transferTxId } },
                undefined,
                true,
            );
        });
    }

    /**
     * 开始转移交易上链回调
     * @param orderObj
     * @param txId
     */
    async onTransferTxStartCallback(orderObj: AirdropOrderObj, txId: string): Promise<void> {
        await this.__startTransfer(orderObj, txId);
    }

    /**
     * 开始空投转移
     * @param orderObj
     * @param transferTxId
     */
    private async __startTransfer(orderObj: AirdropOrderObj, transferTxId: string) {
        const { orderId, type, chainName, issueTxId } = orderObj;
        let { dpNo, transferAddress } = orderObj.getTransferTxObj(transferTxId);
        if (transferTxId === AirdropHelper.genDefaultTransferTxId(orderId, dpNo)) {
            try {
                const trans = await this.__internalChainTransMgr.getTrans({ chainName, txId: issueTxId });
                const getTransferParam = async () => {
                    if (type === AIRDROP_TYPE.NORMAL) {
                        const trJson = trans.trJson as TransactionMaker.Transaction.IssueEntityTransactionV1JSON;
                        return {
                            transferEntityId: trJson.asset.issueEntity.entityId,
                            taxCollector: trJson.senderId,
                            taxAssetPrealnum: trJson.asset.issueEntity.taxAssetPrealnum,
                        };
                    }
                    const trJson = trans.trJson as TransactionMaker.Transaction.IssueEntityMultiTransactionV1JSON;
                    return {
                        transferEntityId: AirdropHelper.genTransferDpEntityId(
                            trJson.asset.issueEntityMulti.entityStructList[0].entityId,
                            trJson.asset.issueEntityMulti.entityStructList.length,
                            dpNo,
                        ),
                        taxCollector: trJson.senderId,
                        taxAssetPrealnum: trJson.asset.issueEntityMulti.entityStructList[0].taxAssetPrealnum,
                    };
                };
                const { transferEntityId, taxCollector, taxAssetPrealnum } = await getTransferParam();
                // 内链平台账户
                const platformAccount = await this.__globalValueRedisRepository.getAirdropAccount(type);
                const resp = await this.__internalChainTransMgr.createTransferEntity({
                    chainName,
                    secret: platformAccount.secret,
                    recipientId: transferAddress,
                    entityId: transferEntityId,
                    taxInformation: { taxCollector, taxAssetPrealnum },
                    param: {
                        mqId: LOCAL_MQ_ID,
                        linkType: TRANSACTION_LINK_TYPE.AIRDROP_ORDER,
                        linkId: orderId,
                    },
                    remark: { from: "Wallet" },
                });
                transferTxId = await orderObj.updateTransferTxId(transferTxId, resp.txId);
            } catch (e) {
                // 未注入私钥，或发起账户余额不足，或生成交易体失败（可能是maker繁忙），在队列外等待，卡住其他的消费者，降低并发
                await sleep(INTERNAL_TRANS_RETRY_INVERVAL);
                throw e;
            }
        }
        await this.__internalChainTransMgr.createTransObj({ chainName, txId: transferTxId });
    }

    /**
     * 内链上链成功回调
     * @param orderObj
     * @param trans
     */
    async onInternalChainSuccessCallback(orderObj: AirdropOrderObj, trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        await orderObj.updateTransferTxOnChain(trans.entityId);
        if (orderObj.pendingTransferTxObjMap.size === 0) {
            // 没有pending交易了，则进入成功状态
            await orderObj.changeState(AIRDROP_ORDER_STATE_ID.SUCCESS, this.getStateId());
        }
    }

    /**
     * 内链上链失败回调
     * @param orderObj
     * @param trans
     */
    async onInternalChainFailCallback(orderObj: AirdropOrderObj, trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        // 转移交易必须成功，否则不断重试
        await orderObj.retryTransferTx(trans.entityId);
        if (orderObj.isAllPendingTransRetryOverLimit()) {
            // 所有pending交易都超过最大重试次数，则进入失败状态
            await orderObj.changeState(AIRDROP_ORDER_STATE_ID.TRANSFER_TX_ON_CHAIN_FAIL, this.getStateId());
        }
    }
}
