import { PromiseOut, EasyMap, QueneEventEmitter } from "@bnqkl/util-node";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import type {
    InternalChainName} from "@bnqkl/wallet-sdk";
import {
    $asyncAllNoNullMap,
    CommonHelper,
    InternalTransStateID,
    Logger,
    MQ_CONSUME_MAX_SPEED,
    TRANS_TEMP_QUEUE_ROUTING_KEY,
} from "@bnqkl/wallet-sdk";
import { LOCAL_MQ_ID, CHAIN_TRANS_TYPE } from "../../common/constants/index.js";
import type { InternalTransactionBase } from "../../common/entity/index.js";
import type { FindOptionsWhere } from "typeorm";
import type { InternalChainTransService } from "./internal-chain-trans.service.js";
import { InternalChainTransObj } from "./internal-chain-trans-obj.js";
import type { InternalTransState} from "./state/index.js";
import { OnChainFail_InternalTransState, Success_InternalTransState, WaitOnChain_InternalTransState } from "./state/index.js";
import { ChainTransMgr } from "../../common/chain-trans/chain-trans-mgr.js";
import { staticConfig } from "../../config/index.js";
import { transactionMaker, TransHelper } from "../../helper/index.js";
import type {
    CreateInternalTransferAssetReqDto,
    SaveInternalTransactionReqDto,
    CreateInternalTransObjReqDto,
    GetInternalTransReqDto,
    GetInternalAccountBalanceReqDto,
    UpdateInternalTransStateReqDto,
    GetInternalAccountsBalanceReqDto,
    CreateIssueEntityReqDto,
    CreateTransferEntityReqDto,
    CreateVoteTrReqDto,
    CreateIssueEntityFactoryReqDto,
    CreateIssueEntityMultiReqDto,
    CreateInternalIncreaseAssetReqDto,
    CreateInternalDestroyAssetReqDto,
    CreateInternalStakeAssetReqDto,
    CreateInternalUnstakeAssetReqDto,
    CreateInternalIssueAssetReqDto,
    GetInternalAssetDetailsReqDto,
} from "./dto/index.js";
import { walletPublisher, walletConsumer } from "../mq/index.js";
import {
    BfmChainService,
    BFChainV2Service,
    CcchainService,
    PMChainService,
    ETHMetaService,
    BTCMetaService,
    BTGMetaService,
    BIWMetaService,
    MalibuService,
} from "../bcf/bcf.service.js";

/**内链交易管理器 */
@Injectable()
export class InternalChainTransMgr extends ChainTransMgr<
    InternalTransStateID,
    InternalChainName,
    InternalTransState,
    InternalTransactionBase,
    InternalChainTransObj
> {
    @Inject(forwardRef(() => BfmChainService))
    private __bfmService!: BfmChainService;
    @Inject(forwardRef(() => BFChainV2Service))
    private __bfchainv2Service!: BFChainV2Service;
    @Inject(forwardRef(() => CcchainService))
    private __ccchainService!: CcchainService;
    @Inject(forwardRef(() => PMChainService))
    private __pmchainService!: PMChainService;
    @Inject(forwardRef(() => ETHMetaService))
    private __ethMetaService!: ETHMetaService;
    @Inject(forwardRef(() => BTCMetaService))
    private __btcMetaService!: BTCMetaService;
    @Inject(forwardRef(() => BTGMetaService))
    private __btgMetaService!: BTGMetaService;
    @Inject(forwardRef(() => BIWMetaService))
    private __biwMetaService!: BIWMetaService;
    @Inject(forwardRef(() => MalibuService))
    private __malibuService!: MalibuService;
    @Inject(forwardRef(() => WaitOnChain_InternalTransState))
    private __waitOnChain_InternalTransState!: WaitOnChain_InternalTransState;
    @Inject(forwardRef(() => OnChainFail_InternalTransState))
    private __onChainFail_InternalTransState!: OnChainFail_InternalTransState;
    @Inject(forwardRef(() => Success_InternalTransState))
    private __success_InternalTransState!: Success_InternalTransState;
    @Inject(forwardRef(() => QueneEventEmitter<Wallet.InternalChainTransMgrEvents>))
    public emiter!: QueneEventEmitter<Wallet.InternalChainTransMgrEvents>;

    /**本地更新到最新高度 */
    private __localUpdateToLatestPromiseMap = EasyMap.from({
        creater: (chainName: InternalChainName) => {
            return new PromiseOut<void>();
        },
    });

    constructor() {
        super(CHAIN_TRANS_TYPE.INTERNAL);
    }

    newTransObj(trans: InternalTransactionBase): InternalChainTransObj {
        return new InternalChainTransObj(trans, this);
    }

    /**
     * 初始化
     */
    async init(): Promise<void> {
        // 注册state
        this.registerState(this.__waitOnChain_InternalTransState);
        this.registerState(this.__onChainFail_InternalTransState);
        this.registerState(this.__success_InternalTransState);
        // 加载交易
        await this.loadTransaction();
        // 监听事件
        this.listenEvents();
        this.tick();
    }

    /**
     * 获取交易service
     * @param chainName
     */
    getTransactionService(chainName: InternalChainName) {
        switch (chainName) {
            case this.__bfmService.chainName:
                return this.__bfmService;
            case this.__ccchainService.chainName:
                return this.__ccchainService;
            case this.__pmchainService.chainName:
                return this.__pmchainService;
            case this.__ethMetaService.chainName:
                return this.__ethMetaService;
            case this.__bfchainv2Service.chainName:
                return this.__bfchainv2Service;
            case this.__btgMetaService.chainName:
                return this.__btgMetaService;
            case this.__btcMetaService.chainName:
                return this.__btcMetaService;
            case this.__biwMetaService.chainName:
                return this.__biwMetaService;
            case this.__malibuService.chainName:
                return this.__malibuService;
            default:
                break;
        }
        throw new Error(`chainName:${chainName} is not exist.`);
    }

    /**
     * 等待本地更新到最新高度
     */
    waitLocalUpdateToLatest(chainName: InternalChainName) {
        return this.__localUpdateToLatestPromiseMap.forceGet(chainName).promise;
    }

    /**
     * 获取待处理交易的条件
     */
    getPendingTransOptions(): FindOptionsWhere<InternalTransactionBase> {
        return { state: InternalTransStateID.WAIT_ON_CHAIN };
    }

    /**
     * 获取初始化交易的条件
     */
    getInitTransOptions(): FindOptionsWhere<InternalTransactionBase> {
        return { state: InternalTransStateID.INIT, linkType: 0 };
    }

    /**
     * 设置交易为待处理
     * @param trans
     */
    setTransPending(trans: InternalTransactionBase): void {
        trans.state = InternalTransStateID.WAIT_ON_CHAIN;
    }

    /**
     * 加载交易
     */
    async loadTransaction() {
        await this.__loadTransaction(this.__bfmService);
        await this.__loadTransaction(this.__ccchainService);
        await this.__loadTransaction(this.__pmchainService);
        await this.__loadTransaction(this.__ethMetaService);
        await this.__loadTransaction(this.__bfchainv2Service);
        await this.__loadTransaction(this.__btgMetaService);
        await this.__loadTransaction(this.__btcMetaService);
        await this.__loadTransaction(this.__biwMetaService);
        await this.__loadTransaction(this.__malibuService);
    }

    /**
     * 监听事件
     */
    listenEvents() {
        this.__bfmService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__bfmService);
            // 处理完自己的逻辑，再触发onBfmNewBlock事件
            this.emiter.emit("onBfmNewBlock", newHeight);
        });
        this.__ccchainService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__ccchainService);
            // 处理完自己的逻辑，再触发onCCCNewBlock事件
            this.emiter.emit("onCCCNewBlock", newHeight);
        });
        this.__pmchainService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__pmchainService);
            // 处理完自己的逻辑，再触发onPmchainNewBlock事件
            this.emiter.emit("onPmchainNewBlock", newHeight);
        });
        this.__ethMetaService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__ethMetaService);
            // 处理完自己的逻辑，再触发onEthmetaNewBlock事件
            this.emiter.emit("onEthmetaNewBlock", newHeight);
        });
        this.__bfchainv2Service.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__bfchainv2Service);
            // 处理完自己的逻辑，再触发onBFChainV2NewBlock事件
            this.emiter.emit("onBFChainV2NewBlock", newHeight);
        });
        this.__btgMetaService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__btgMetaService);
            // 处理完自己的逻辑，再触发onBTGMetaNewBlock事件
            this.emiter.emit("onBTGMetaNewBlock", newHeight);
        });
        this.__btcMetaService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__btcMetaService);
            // 处理完自己的逻辑，再触发onBTCMetaNewBlock事件
            this.emiter.emit("onBTCMetaNewBlock", newHeight);
        });
        this.__biwMetaService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__biwMetaService);
            // 处理完自己的逻辑，再触发onBIWMetaNewBlock事件
            this.emiter.emit("onBIWMetaNewBlock", newHeight);
        });
        this.__malibuService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__malibuService);
            // 处理完自己的逻辑，再触发onMalibuNewBlock事件
            this.emiter.emit("onMalibuNewBlock", newHeight);
        });
        this.heightGetter();
    }

    /**
     * 获取链的最新高度
     */
    heightGetter() {
        if (staticConfig.chainConfig.chain.bcf["bfm"] && staticConfig.chainConfig.chain.bcf["bfm"].enable) {
            this.__bfmService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["ccchain"] && staticConfig.chainConfig.chain.bcf["ccchain"].enable) {
            this.__ccchainService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["pmchain"] && staticConfig.chainConfig.chain.bcf["pmchain"].enable) {
            this.__pmchainService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["ethm"] && staticConfig.chainConfig.chain.bcf["ethm"].enable) {
            this.__ethMetaService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["bfchainv2"] && staticConfig.chainConfig.chain.bcf["bfchainv2"].enable) {
            this.__bfchainv2Service.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["btgmeta"] && staticConfig.chainConfig.chain.bcf["btgmeta"].enable) {
            this.__btgMetaService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["btcmeta"] && staticConfig.chainConfig.chain.bcf["btcmeta"].enable) {
            this.__btcMetaService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["biwmeta"] && staticConfig.chainConfig.chain.bcf["biwmeta"].enable) {
            this.__biwMetaService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bcf["malibu"] && staticConfig.chainConfig.chain.bcf["malibu"].enable) {
            this.__malibuService.heightGetter();
        }
    }

    /**
     * 处理同步新区块事件
     * @param newHeight
     * @param transService
     */
    private async __onNewBlock(newHeight: number, transService: InternalChainTransService) {
        const chainName = transService.chainName;
        if (this.__processingNewBlockMap.get(chainName)) {
            return;
        }
        this.__processingNewBlockMap.set(chainName, true);
        try {
            // 处理小于本地高度的交易上链
            await this.__processTransLteLocalHeight(transService);
            let minHeight = (await transService.getLocalLastBlockHeight()) + 1;
            const maxHeight = newHeight;
            if (minHeight > maxHeight) {
                Logger.warn(`getTrOnChain[${chainName}] minHeight:${minHeight} > maxHeight:${maxHeight}`);
                return;
            }
            Logger.debug(`getTrOnChain[${chainName}] from ${minHeight} to ${maxHeight}`);
            for (let height = minHeight; height <= maxHeight; height++) {
                await this.__processTransByHeight(height, transService);
            }
            this.__localUpdateToLatestPromiseMap.forceGet(chainName).resolve();
        } catch (e) {
            Logger.error(e);
        } finally {
            this.__processingNewBlockMap.delete(chainName);
        }
    }

    /**
     * 处理小于本地高度的交易上链
     * @param transService
     */
    private async __processTransLteLocalHeight(transService: InternalChainTransService) {
        const localHeight = await transService.getLocalLastBlockHeight();
        const chainName = transService.chainName;
        const transObjMap = this.__processingTransObjMap.get(chainName);
        if (!transObjMap) {
            return;
        }
        const transObjArray = Array.from(transObjMap.values());
        await CommonHelper.pageLoop(
            MQ_CONSUME_MAX_SPEED,
            async () => {
                const count = transObjArray.length;
                count > 0 && Logger.debug(`[${chainName}] processing count: ${count}`);
                return count;
            },
            async (page: number, pageSize: number) => {
                const start = page * pageSize;
                const end = start + pageSize;
                const datas = transObjArray.slice(start, end);
                return datas;
            },
            async (transObj) => {
                if (localHeight < transObj.entity.applyBlockHeight + 10) {
                    // 事件发起后10个高度之内，不查
                    return;
                }
                try {
                    // 先用交易签名查一下小于本地高度时，是否上链，防止本地高度过了再也同步不到的问题
                    const trans = (
                        await transService.getChainTransactions({
                            minHeight: 1,
                            maxHeight: localHeight,
                            signature: transObj.signature,
                        })
                    )[0];
                    if (trans) {
                        const signature = trans.transaction.signature;
                        const onChainHeight = trans.height;
                        Logger.debug(`[${chainName}] onChainHeight:${onChainHeight} signature:${signature} is onchain success`);
                        await transObj.onChainSuccessCallback(onChainHeight, signature);
                    }
                } catch (e) {
                    // 不throw，不影响其他交易
                    Logger.error(e);
                }
            },
            async (page, pageTimeStart, datas) => {
                Logger.debug(
                    `[${chainName}] __processTransLteLocalHeight. page:${page} datas:${datas.length} Finish costTime:${Date.now() - pageTimeStart} ms`,
                );
            },
            (timeStart: number) => {
                const costTime = Date.now() - timeStart;
                if (costTime > 5000) {
                    Logger.debug(`[${chainName}] __processTransLteLocalHeight costTime: ${costTime} ms`);
                }
            },
        );
    }

    /**
     * 处理某一高度的全部交易
     * @param height
     * @param transService
     */
    private async __processTransByHeight(height: number, transService: InternalChainTransService) {
        const chainName = transService.chainName;
        const transactions = await transService.getChainTransactions({
            minHeight: height,
            maxHeight: height,
        });
        Logger.debug(`[${chainName}] height:${height} trs.length:${transactions.length}`);
        try {
            let allBlobHashArray: string[] = [];
            // 处理上链成功的交易
            await $asyncAllNoNullMap(transactions, async (tr) => {
                const signature = tr.transaction.signature;
                const transObj = this.__getProcessingTrans(chainName, signature);
                if (!transObj) {
                    return;
                }
                allBlobHashArray = allBlobHashArray.concat(TransHelper.getTransBlobHashArray(tr.transaction));
                // Logger.debug(`[${chainName}] height:${height} signature:${signature} is onchain success`);
                await transObj.onChainSuccessCallback(height, signature);
            });
            if (allBlobHashArray.length > 0) {
                // 更改上链成功后blob的存储区域
                const maker = await transactionMaker.getTrMaker(chainName);
                Logger.debug(`[${chainName}] height:${height} changeBlobsPath. allBlobHashArray:${allBlobHashArray}`);
                await maker.transaction.changeBlobsPath({ blobHashArray: allBlobHashArray, height });
            }
            // 处理等待上链的交易
            const transObjMap = this.__processingTransObjMap.get(chainName);
            if (transObjMap) {
                await $asyncAllNoNullMap(Array.from(transObjMap.values()), async (transObj) => {
                    // 同步到某个高度的回调
                    await transObj.onHeightCallback(height);
                });
            }
        } finally {
            // 改变本地高度
            await transService.setLocalLastBlockHeight(height);
        }
    }

    /**
     * 处理mq连接事件
     */
    async processMqConnect() {
        // 处理交易开始上链
        this.__processOnChainStart();
    }

    /**
     * 处理mq重连事件
     */
    async processMqReConnect() {
        for (const [chainName, transObjMap] of this.__processingTransObjMap) {
            for (const { curStateId, signature } of transObjMap.values()) {
                if (curStateId === InternalTransStateID.WAIT_ON_CHAIN) {
                    await walletPublisher.publishOnChainEvent(
                        TRANS_TEMP_QUEUE_ROUTING_KEY.INTERNAL_ON_CHAIN_START,
                        { chainName, entityId: signature },
                        LOCAL_MQ_ID,
                        true,
                    );
                }
            }
        }
    }

    /**
     * 处理交易开始上链
     */
    private __processOnChainStart() {
        walletConsumer.consumeOnChainEvent(
            TRANS_TEMP_QUEUE_ROUTING_KEY.INTERNAL_ON_CHAIN_START,
            async ({ chainName, entityId: signature }) => {
                const transObj = this.__getProcessingTrans(chainName as InternalChainName, signature);
                if (!transObj) {
                    // 内存中找不到交易，只打印错误，不重试
                    Logger.warn(`couldn't found [${chainName}] transObj:${signature} is Processing in ${TRANS_TEMP_QUEUE_ROUTING_KEY.INTERNAL_ON_CHAIN_START}`);
                    return;
                }
                await transObj.onChainStartCallback();
            },
            LOCAL_MQ_ID,
            true,
        );
    }

    /**
     * 生成权益转移交易
     * @param dto
     * @returns
     */
    async createTransferAsset(dto: CreateInternalTransferAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalTransferAssetResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createTransferAsset(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成发行权益交易
     * @param dto
     * @returns
     */
    async createIssueAsset(dto: CreateInternalIssueAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalIssueAssetResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createIssueAsset(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成增发权益交易
     * @param dto
     * @returns
     */
    async createIncreaseAsset(dto: CreateInternalIncreaseAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalIncreaseAssetResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createIncreaseAsset(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成销毁权益交易
     * @param dto
     * @returns
     */
    async createDestroyAsset(dto: CreateInternalDestroyAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalDestroyAssetResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createDestroyAsset(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成质押权益交易
     * @param dto
     * @returns
     */
    async createStakeAsset(dto: CreateInternalStakeAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalStakeAssetResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createStakeAsset(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成解除质押权益交易
     * @param dto
     * @returns
     */
    async createUnstakeAsset(dto: CreateInternalUnstakeAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalUnstakeAssetResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createUnstakeAsset(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成发行非同质资产模板交易
     * @param dto
     * @returns
     */
    async createIssueEntityFactory(dto: CreateIssueEntityFactoryReqDto): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityFactoryResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createIssueEntityFactory(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成发行非同质资产交易
     * @param dto
     * @returns
     */
    async createIssueEntity(dto: CreateIssueEntityReqDto): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createIssueEntity(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成批量发行非同质资产交易
     * @param dto
     * @returns
     */
    async createIssueEntityMulti(dto: CreateIssueEntityMultiReqDto): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityMultiResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createIssueEntityMulti(dto);
        return { txId: trans.entityId };
    }

    /**
     * 生成转移资产交易
     * @param dto
     * @returns
     */
    async createTransferEntity(dto: CreateTransferEntityReqDto): Promise<WalletTypings.InternalChain.Api.CreateTransferEntityResDto> {
        const transactionService = this.getTransactionService(dto.chainName);
        const trans = await transactionService.createTransferEntity(dto);
        return { txId: trans.entityId };
    }

    /**
     * 保存内链交易
     * @param dto
     * @returns
     */
    async saveTransaction(dto: SaveInternalTransactionReqDto): Promise<WalletTypings.InternalChain.Api.SaveInternalTransactionResDto> {
        const { chainName, transactionJSON, param } = dto;
        const transactionService = this.getTransactionService(chainName);
        const trans = await transactionService.createTransaction(transactionJSON, param);
        return { txId: trans.entityId };
    }

    /**
     * 生成内链交易逻辑对象
     * @param dto
     */
    async createTransObj(dto: CreateInternalTransObjReqDto): Promise<void> {
        const { chainName, txId } = dto;
        const transactionService = this.getTransactionService(chainName);
        const repository = transactionService.repository;
        const updateTransResult = await repository.update({ entityId: txId, state: InternalTransStateID.INIT }, { state: InternalTransStateID.WAIT_ON_CHAIN });
        if (updateTransResult.affected && updateTransResult.affected > 0) {
            await TransHelper.createInternalTransObj(chainName, txId);
        }
    }

    /**
     * 获取内链交易
     * @param dto
     * @returns
     */
    async getTrans(dto: GetInternalTransReqDto): Promise<WalletTypings.InternalChain.Api.GetInternalTransResDto> {
        const { chainName, txId } = dto;
        const transactionService = this.getTransactionService(chainName);
        return await transactionService.repository.findOneForce({ where: { entityId: txId } });
    }

    /**
     * 获取内链账户余额
     * @param dto
     * @returns
     */
    async getAccountBalance(dto: GetInternalAccountBalanceReqDto): Promise<WalletTypings.InternalChain.Api.GetInternalAccountBalanceResDto> {
        const { chainName, address, assetType } = dto;
        const transactionService = this.getTransactionService(chainName);
        const result = await transactionService.getAddressBalance({ address, assetType });
        if (!result.success) {
            throw Error(`address:${address} getAddressBalance fail`);
        }
        return { amount: result.result.amount };
    }

    /**
     * 更新内链交易状态
     * @param dto
     * @returns
     */
    async updateTransState(dto: UpdateInternalTransStateReqDto): Promise<WalletTypings.InternalChain.Api.UpdateInternalTransStateResDto> {
        const { chainName, txId, state } = dto;
        const transactionService = this.getTransactionService(chainName);
        const updateTransResult = await transactionService.repository.update({ entityId: txId }, { state });
        return updateTransResult.affected && updateTransResult.affected > 0 ? true : false;
    }

    /**
     * 获取链的资产信息
     * @param dto
     * @returns
     */
    async getAllAccountAsset(dto: GetInternalAccountsBalanceReqDto): Promise<BFChainWallet.BCF.GetAllAccountAssetResp> {
        const { chainName, filter } = dto;
        const transactionService = this.getTransactionService(chainName);
        const result = await transactionService.getAllAccountAsset(filter);
        if (result && result.success) {
            return result.result;
        } else {
            throw Error(JSON.stringify(result));
        }
    }

    /**
     * 生成内链投票交易
     * @param dto
     * @returns
     */
    async createVoteTr(dto: CreateVoteTrReqDto): Promise<WalletTypings.InternalChain.Api.CreateVoteTrResDto> {
        const { chainName, data } = dto;
        const transactionService = this.getTransactionService(chainName);
        const tr = await transactionService.generateVoteTrJson(data);
        return { tr };
    }

    /**
     * 生成转移资产交易
     * @param dto
     * @returns
     */
    async getAssetDetails(dto: GetInternalAssetDetailsReqDto): Promise<BFChainWallet.BCF.GetAssetDetailsResp> {
        const transactionService = this.getTransactionService(dto.chainName);
        const result = await transactionService.getAssetDetails(dto.assetType);
        if (result.success) {
            return result.result;
        } else {
            throw result;
        }
    }
}
