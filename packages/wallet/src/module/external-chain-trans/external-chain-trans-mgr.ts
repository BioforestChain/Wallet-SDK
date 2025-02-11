import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
    CommonHelper,
    ExternalChainHelper,
    ExternalChainName,
    ExternalMainAssetType,
    ExternalTransStateID,
    Logger,
    MQ_CONSUME_MAX_SPEED,
    RedisLock,
    TRANS_TEMP_QUEUE_ROUTING_KEY,
} from "@bnqkl/wallet-sdk";
import { CHAIN_INFO_KEY_TYPE, ExternalTransactionBase, LOCAL_MQ_ID, ChainTransMgr, CHAIN_TRANS_TYPE } from "../../common";
import { EthService } from "../eth/eth.service";
import { BscService } from "../bsc/bsc.service";
import { TronService } from "../tron/tron.service";
import { ExternalTransState, OnChainFail_ExternalTransState, Success_ExternalTransState, WaitOnChain_ExternalTransState } from "./state";
import { ExternalChainTransObj } from "./external-chain-trans-obj";
import { FindOptionsWhere } from "typeorm";
import { ExternalChainTransService } from "./external-chain-trans.service";
import { ChainInfoRedisRepository } from "../redis/chain-info.redis-repository";
import { TransHelper } from "../../helper";
import {
    CreateExternalTransferReqDto,
    SaveExternalTransactionReqDto,
    CreateExternalTransObjReqDto,
    GetExternalTransReqDto,
    GetExternalTransFeeInfoReqDto,
    GetExternalBalanceReqDto,
    GetExternalAccountBalanceReqDto,
    GetExternalForgeIntervalReqDto,
    UpdateExternalTransStateReqDto,
} from "./dto";
import { ContractTokenInfoService } from "../contract-token-info/contract-token-info.service";
import { staticConfig } from "../../config";
import { walletPublisher, walletConsumer } from "../mq";

/**外链交易管理器 */
@Injectable()
export class ExternalChainTransMgr extends ChainTransMgr<
    ExternalTransStateID,
    ExternalChainName,
    ExternalTransState,
    ExternalTransactionBase,
    ExternalChainTransObj
> {
    @Inject(forwardRef(() => EthService))
    private __ethService!: EthService;
    @Inject(forwardRef(() => BscService))
    private __bscService!: BscService;
    @Inject(forwardRef(() => TronService))
    private __tronService!: TronService;
    @Inject(forwardRef(() => WaitOnChain_ExternalTransState))
    private __waitOnChain_ExternalTransState!: WaitOnChain_ExternalTransState;
    @Inject(forwardRef(() => OnChainFail_ExternalTransState))
    private __onChainFail_ExternalTransState!: OnChainFail_ExternalTransState;
    @Inject(forwardRef(() => Success_ExternalTransState))
    private __success_ExternalTransState!: Success_ExternalTransState;
    @Inject(forwardRef(() => ChainInfoRedisRepository))
    private __chainInfoRedisRepository!: ChainInfoRedisRepository;
    @Inject(forwardRef(() => ContractTokenInfoService))
    private __contractTokenInfoService!: ContractTokenInfoService;

    constructor() {
        super(CHAIN_TRANS_TYPE.EXTERNAL);
    }

    newTransObj(trans: ExternalTransactionBase): ExternalChainTransObj {
        return new ExternalChainTransObj(trans, this);
    }

    /**
     * 初始化
     */
    async init(): Promise<void> {
        // 注册state
        this.registerState(this.__waitOnChain_ExternalTransState);
        this.registerState(this.__onChainFail_ExternalTransState);
        this.registerState(this.__success_ExternalTransState);
        // 监听事件
        this.listenEvents();
        // 加载交易
        await this.loadTransaction();
        this.tick();
    }

    /**
     * 获取交易service
     * @param chainName
     */
    getTransactionService(chainName: ExternalChainName) {
        switch (chainName) {
            case this.__ethService.chainName:
                return this.__ethService;
            case this.__bscService.chainName:
                return this.__bscService;
            case this.__tronService.chainName:
                return this.__tronService;
            default:
                break;
        }
        throw new Error(`chainName:${chainName} is not exist.`);
    }

    /**
     * 获取待处理交易的条件
     */
    getPendingTransOptions(): FindOptionsWhere<ExternalTransactionBase> {
        return { state: ExternalTransStateID.WAIT_ON_CHAIN };
    }

    /**
     * 获取初始化交易的条件
     */
    getInitTransOptions(): FindOptionsWhere<ExternalTransactionBase> {
        return { state: ExternalTransStateID.INIT, linkType: 0 };
    }

    /**
     * 设置交易为待处理
     * @param trans
     */
    setTransPending(trans: ExternalTransactionBase): void {
        trans.state = ExternalTransStateID.WAIT_ON_CHAIN;
    }

    /**
     * 加载交易
     */
    async loadTransaction() {
        await this.__loadTransaction(this.__ethService);
        await this.__loadTransaction(this.__bscService);
        await this.__loadTransaction(this.__tronService);
    }

    /**
     * 监听事件
     */
    listenEvents() {
        this.__ethService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__ethService);
        });
        this.__bscService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__bscService);
        });
        this.__tronService.on("onNewBlock", async (newHeight: number) => {
            await this.__onNewBlock(newHeight, this.__tronService);
        });
        this.heightGetter();
    }

    /**
     * 获取链的最新高度
     */
    heightGetter() {
        if (staticConfig.chainConfig.chain.eth && staticConfig.chainConfig.chain.eth.enable) {
            this.__ethService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.bsc && staticConfig.chainConfig.chain.bsc.enable) {
            this.__bscService.heightGetter();
        }
        if (staticConfig.chainConfig.chain.tron && staticConfig.chainConfig.chain.tron.enable) {
            this.__tronService.heightGetter();
        }
    }

    /**
     * 处理同步新区块事件
     * @param newHeight
     * @param transService
     */
    private async __onNewBlock(newHeight: number, transService: ExternalChainTransService) {
        const chainName = transService.chainName;
        if (this.__processingNewBlockMap.get(chainName)) {
            return;
        }
        this.__processingNewBlockMap.set(chainName, true);
        try {
            // 处理交易上链
            await this.__processTransOnChain(newHeight, transService);
        } catch (e) {
            Logger.error(e);
        } finally {
            this.__processingNewBlockMap.delete(chainName);
        }
    }

    /**
     * 处理交易上链
     * @param newHeight
     * @param transService
     */
    private async __processTransOnChain(newHeight: number, transService: ExternalChainTransService) {
        const chainName = transService.chainName;
        if (newHeight % 10 === 0) {
            Logger.debug(`[${chainName}] height:${newHeight}`);
        }
        const transObjMap = this.__processingTransObjMap.get(chainName);
        if (!transObjMap) {
            return;
        }
        const transObjArray = Array.from(transObjMap.values());
        await CommonHelper.pageLoop(
            MQ_CONSUME_MAX_SPEED,
            async () => {
                const count = transObjArray.length;
                if (newHeight % 10 === 0) {
                    Logger.debug(`[${chainName}] processing count: ${count}`);
                }
                return count;
            },
            async (page: number, pageSize: number) => {
                const start = page * pageSize;
                const end = start + pageSize;
                const datas = transObjArray.slice(start, end);
                return datas;
            },
            async (transObj) => {
                try {
                    const { txId, txHash } = transObj;
                    if (!txHash) {
                        return;
                    }
                    const __checkWithReceipt = async (resp: { blockNumber: number; status: boolean }) => {
                        if (!resp.status) {
                            // 存在, status=false，上链失败
                            await transObj.onChainFailCallback("receipt status false");
                            return;
                        }
                        // 存在, status=true，上链成功
                        await transObj.onChainSuccessCallback(resp.blockNumber, txHash);
                    };
                    // 获取交易收据
                    const receipt = await transService.getTransReceipt(txHash);
                    if (receipt) {
                        await __checkWithReceipt(receipt);
                        return;
                    }
                    // 检查是否过期
                    if (await transService.checkExpire(transObj.entity)) {
                        const receipt = await transService.getTransReceipt(txHash);
                        // 可能在checkExpire执行时，txHash上链了，导致expire，所以expire后要再查一次回执
                        if (receipt) {
                            await __checkWithReceipt(receipt);
                            return;
                        }
                        // 过期，判定为失败
                        await transObj.onChainFailCallback("check expire");
                        return;
                    }
                    const queryCount = await this.__chainInfoRedisRepository.incrbyHash(chainName, CHAIN_INFO_KEY_TYPE.EXTERNAL_TRANS_QUERY, txId, 1);
                    if (queryCount < transService.getMaxQueryCount()) {
                        return;
                    }
                    // 超过最大查询次数，判定为失败
                    await transObj.onChainFailCallback("queryCount over limit");
                } catch (e) {
                    // 不throw，不影响其他交易
                    Logger.error(e);
                }
            },
            async (page, pageTimeStart) => {
                const costTime = Date.now() - pageTimeStart;
                if (costTime > 5000) {
                    Logger.debug(`[${chainName}] __processTransOnChain. page:${page} Finish costTime:${costTime} ms`);
                }
            },
            (timeStart: number) => {
                const costTime = Date.now() - timeStart;
                if (costTime > 5000) {
                    Logger.debug(`[${chainName}] __processTransOnChain costTime: ${costTime} ms`);
                }
            },
        );
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
            for (const { curStateId, txId } of transObjMap.values()) {
                if (curStateId === ExternalTransStateID.WAIT_ON_CHAIN) {
                    await walletPublisher.publishOnChainEvent(
                        TRANS_TEMP_QUEUE_ROUTING_KEY.EXTERNAL_ON_CHAIN_START,
                        { chainName, entityId: txId },
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
            TRANS_TEMP_QUEUE_ROUTING_KEY.EXTERNAL_ON_CHAIN_START,
            async ({ chainName, entityId }) => {
                const transObj = this.__getProcessingTrans(chainName as ExternalChainName, entityId);
                if (!transObj) {
                    // 内存中找不到交易，只打印错误，不重试
                    Logger.warn(`couldn't found [${chainName}] transObj:${entityId} is Processing in ${TRANS_TEMP_QUEUE_ROUTING_KEY.EXTERNAL_ON_CHAIN_START}`);
                    return;
                }
                await transObj.onChainStartCallback();
            },
            LOCAL_MQ_ID,
            true,
        );
    }

    /**
     * 生成外链转账交易
     * @param dto
     * @returns
     */
    async createTransfer(dto: CreateExternalTransferReqDto): Promise<WalletTypings.ExternalChain.Api.CreateExternalTransferResDto> {
        const { chainName, account, recipientId, contractAddress, amount, param } = dto;
        const transactionService = this.getTransactionService(chainName);
        let balanceAmount: string;
        let symbol: string;
        if (contractAddress) {
            const balanceItem = (await transactionService.getAccountBalanceV2({ address: account.address, contracts: [contractAddress] }))[0];
            balanceAmount = balanceItem.amount;
            const info = await this.__contractTokenInfoService.getContractInfoForce(transactionService.chainName, contractAddress);
            symbol = info.symbol;
        } else {
            balanceAmount = await this.getBalance({ chainName, address: account.address });
            switch (chainName) {
                case ExternalChainName.ETH:
                    symbol = ExternalMainAssetType.ETH;
                    break;
                case ExternalChainName.BSC:
                    symbol = ExternalMainAssetType.BNB;
                    break;
                case ExternalChainName.TRON:
                    symbol = ExternalMainAssetType.TRX;
                    break;
                default:
                    throw Error(`not support ${chainName}`);
            }
        }
        const externalBalance = BigInt(balanceAmount);
        if (externalBalance < BigInt(amount)) {
            throw Error(`[${chainName}] address:${account.address} externalBalance:${externalBalance} is less than amount:${amount}`);
        }
        // 加分布式锁，防止生成交易体重复
        const lockKey = ExternalChainHelper.getExternalTransLockKey(chainName, account.address);
        return await RedisLock.processByLock(lockKey, async () => {
            const externalDetail: WalletTypings.ExternalChain.ExternalTransDetail & { contract?: string } = {
                from: account.address,
                to: recipientId,
                amount,
                assetSymbol: symbol,
                fee: "0",
                contract: contractAddress ? contractAddress : undefined,
            };
            const trans = await transactionService.createTransferTransaction(account, externalDetail, param);
            return { txId: trans.entityId };
        });
    }

    /**
     * 保存外链交易
     * @param dto
     * @returns
     */
    async saveTransaction(dto: SaveExternalTransactionReqDto): Promise<WalletTypings.ExternalChain.Api.SaveExternalTransactionResDto> {
        const { chainName, transactionJSON, detail, param } = dto;
        const transactionService = this.getTransactionService(chainName);
        const trans = await transactionService.createTransaction(transactionJSON as any, detail, param);
        return { txId: trans.entityId };
    }

    /**
     * 生成外链交易逻辑对象
     * @param dto
     */
    async createTransObj(dto: CreateExternalTransObjReqDto): Promise<void> {
        const { chainName, txId } = dto;
        const transactionService = this.getTransactionService(chainName);
        const updateTransResult = await transactionService.repository.update(
            { entityId: txId, state: ExternalTransStateID.INIT },
            { state: ExternalTransStateID.WAIT_ON_CHAIN },
        );
        if (updateTransResult.affected && updateTransResult.affected > 0) {
            await TransHelper.createExternalTransObj(chainName, txId);
        }
    }

    /**
     * 获取外链交易
     * @param dto
     * @returns
     */
    async getTrans(dto: GetExternalTransReqDto): Promise<WalletTypings.ExternalChain.Api.GetExternalTransResDto> {
        const { chainName, txId } = dto;
        const transactionService = this.getTransactionService(chainName);
        return await transactionService.repository.findOneForce({ where: { entityId: txId } });
    }

    /**
     * 获取外链交易手续费信息
     * @param dto
     * @returns
     */
    async getTransFeeInfo(dto: GetExternalTransFeeInfoReqDto): Promise<WalletTypings.ExternalChain.Api.GetExternalTransFeeInfoResDto> {
        const { chainName, txId } = dto;
        const transactionService = this.getTransactionService(chainName);
        return await transactionService.getTransFeeInfo(txId);
    }

    /**
     * 获取外链主币余额
     * @param dto
     * @returns
     */
    async getBalance(dto: GetExternalBalanceReqDto): Promise<string> {
        const { chainName, address } = dto;
        const transactionService = this.getTransactionService(chainName);
        const balance = await transactionService.getBalance(address);
        return balance;
    }

    /**
     * 获取外链账户余额
     * @param dto
     * @returns
     */
    async getAccountBalance(dto: GetExternalAccountBalanceReqDto): Promise<WalletTypings.ExternalChain.Api.GetExternalAccountBalanceResDto> {
        const { chainName, address, contractAddress } = dto;
        const transactionService = this.getTransactionService(chainName);
        const balanceItem = (await transactionService.getAccountBalanceV2({ address, contracts: [contractAddress] }))[0];
        return balanceItem;
    }

    /**
     * 获取外链打块间隔
     * @param dto
     * @returns
     */
    getForgeInterval(dto: GetExternalForgeIntervalReqDto): number {
        const { chainName } = dto;
        const transactionService = this.getTransactionService(chainName);
        return transactionService.getForgeInterval();
    }

    /**
     * 更新外链交易状态
     * @param dto
     * @returns
     */
    async updateTransState(dto: UpdateExternalTransStateReqDto): Promise<WalletTypings.ExternalChain.Api.UpdateExternalTransStateResDto> {
        const { chainName, txId, state } = dto;
        const transactionService = this.getTransactionService(chainName);
        const updateTransResult = await transactionService.repository.update({ entityId: txId }, { state });
        return updateTransResult.affected && updateTransResult.affected > 0 ? true : false;
    }
}
