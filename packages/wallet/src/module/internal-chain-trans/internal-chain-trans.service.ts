import {
    InternalChainName,
    InternalTransStateID,
    DEFAULT_FEE,
    NUMBER_OF_EFFECTIVE_BLOCKS,
    ChainHelper,
    PARENT_ASSET_TYPE,
    Logger,
    CHAIN_NETWORK_TYPE,
} from "@bnqkl/wallet-sdk";
import { CHAIN_INFO_HKEY, PROJECT_NAME, VERSION } from "../../common/constants.js";
import { FindManyOptions, FindOptionsWhere, In } from "typeorm";
import { InternalTransactionBase } from "../../common/entity.js";
import { ChainTransServiceBase } from "../../common/chain-trans/chain-trans-service.js";
import {
    CreateInternalDestroyAssetReqDto,
    CreateInternalIncreaseAssetReqDto,
    CreateInternalIssueAssetReqDto,
    CreateInternalStakeAssetReqDto,
    CreateInternalTransferAssetReqDto,
    CreateInternalUnstakeAssetReqDto,
    CreateIssueEntityFactoryReqDto,
    CreateIssueEntityMultiReqDto,
    CreateIssueEntityReqDto,
    CreateTransferEntityReqDto,
} from "./dto.js";
import { staticConfig } from "../../config.js";
import { walletSdk, transactionMaker, bfmetaSignUtil } from "../../helper.js";
import {
    BcfQueryBlockReqDto,
    BcfQueryTransactionReqDto,
    BcfGetAddressBalanceReqDto,
    BcfGetAssetsReqDto,
    BcfGetPendingTrReqDto,
    BcfBroadcastTransactionReqDto,
    BcfBroadcastTransactionNotifyReqDto,
} from "../bcf/dto.js";
import { NotifyService } from "../notify/notify.service.js";
import { forwardRef, Inject } from "@nestjs/common";

export abstract class InternalChainTransService extends ChainTransServiceBase<
    InternalTransStateID,
    InternalChainName,
    InternalTransactionBase,
    Wallet.InternalChainApiEvents
> {
    /**创世块信息 */
    private __simpleGenesisAssetInfo?: Wallet.InternalChain.SimpleGenesisAssetInfo;
    @Inject(forwardRef(() => NotifyService))
    public readonly notifyService: NotifyService;
    constructor(chainName: InternalChainName) {
        super(chainName);
    }

    get baseApi() {
        return walletSdk.getInternalChainApi(this.chainName);
    }

    abstract newTransaction(): InternalTransactionBase;

    async getLastBlock() {
        return await this.baseApi.sdk.api.basic.getLastBlock();
    }

    async getBlock(getBlockDto: BcfQueryBlockReqDto) {
        return await this.baseApi.sdk.api.basic.getBlock(getBlockDto);
    }

    // 获得区块时间戳根据高度
    async getBlockTimeStampByHeight(height: number) {
        let maxTryTimes = 10;
        do {
            const result = await this.getBlock({ height });
            if (result.success) {
                return result.result.blocks[0].timestamp;
            }
        } while (--maxTryTimes >= 0);
        throw new Error(`no found block by height:${height}`);
    }

    async getTransactions(dto: BcfQueryTransactionReqDto) {
        if (!dto.maxHeight) {
            dto.maxHeight = await this.getLocalLastBlockHeight();
        }
        // Logger.debug(`[${this.chainName}] getTransactions ${JSON.stringify(dto)}`);
        return await this.baseApi.sdk.api.basic.getTransactions(dto);
    }

    async getChainTransactions(getTransactionsDto: BcfQueryTransactionReqDto) {
        const firstReturn = await this.getTransactions(getTransactionsDto);
        if (!firstReturn.success) {
            throw new Error(firstReturn.error.message);
        }
        let { trs, count, cmdLimitPerQuery } = firstReturn.result;
        const maxPage = count / cmdLimitPerQuery + 1;
        for (let page = 2; page <= maxPage; page++) {
            const ret = await this.getTransactions({
                ...getTransactionsDto,
                page,
            });
            if (!ret.success) {
                throw new Error(ret.error.message);
            }
            trs = trs.concat(ret.result.trs);
        }
        return trs;
    }

    /**
     * getGenesisAssetInfo
     */
    async getGenesisAssetInfo(): Promise<Wallet.InternalChain.SimpleGenesisAssetInfo> {
        if (this.__simpleGenesisAssetInfo) {
            return this.__simpleGenesisAssetInfo;
        }
        const genesisBlock = await this.getBlock({ height: 1 });
        if (!genesisBlock.success) {
            throw Error(`getblock 1 fail`);
        }
        const block = genesisBlock.result.blocks[0];
        const blockAsset = block.asset as any;
        this.__simpleGenesisAssetInfo = {
            forgeInterval: blockAsset.genesisAsset.forgeInterval as number,
            magic: block.magic,
            beginEpochTime: blockAsset.genesisAsset.beginEpochTime as number,
        };

        return this.__simpleGenesisAssetInfo;
    }

    private async __getDiffTime() {
        const __simpleGenesisAssetInfo = await this.getGenesisAssetInfo();
        const time = ((Date.now() - __simpleGenesisAssetInfo.beginEpochTime) / 1000) % __simpleGenesisAssetInfo.forgeInterval;
        return time;
    }

    /**
     * 获取下一个出块间隔
     */
    async getNextBlockInterval(): Promise<number> {
        let diffTime = await this.__getDiffTime();
        let { forgeInterval } = await this.getGenesisAssetInfo();
        /** diffTime - forgeInterval 时间后 节点就应该出块，再预留1/5区块间隔让他同步保存区块 */
        const interval = Math.abs(diffTime - forgeInterval) + forgeInterval / 5;
        return interval;
    }

    /**
     * 获取同步延迟高度
     */
    protected __getSyncDelayHeight(): number {
        return staticConfig.chainConfig.syncInternalDelayHeight ?? 0;
    }

    protected async __heightGetter() {
        return new Promise<number>(async (res, rej) => {
            const id = setTimeout(() => {
                rej(new Error(`__heightGetter[${this.chainName}] timeout`));
            }, 5000);
            try {
                const result = await this.getLastBlock();
                if (result && result.success) {
                    const height = result.result?.height;
                    res(height);
                } else {
                    rej(result.error);
                }
            } finally {
                clearTimeout(id);
            }
        });
    }

    /**
     * 设置远端最新区块高度
     * @param lastBlockHeight
     */
    async setRemoteLastBlockHeight(lastBlockHeight: number) {
        let { magic } = await this.getGenesisAssetInfo();
        const remoteMagic = await this.__chainInfoRedisRepository.getKeyValue(this.chainName, CHAIN_INFO_HKEY.REMOTE_MAGIC);
        if (!remoteMagic || remoteMagic !== magic) {
            // 远端magic不存在或变化了，要设置一次远端magic，并重置本地已同步高度
            await this.__chainInfoRedisRepository.setKeyValue(this.chainName, CHAIN_INFO_HKEY.REMOTE_MAGIC, magic);
            await this.setLocalLastBlockHeight(0);
        }
        await super.setRemoteLastBlockHeight(lastBlockHeight);
    }

    async sdkBroadcastTransaction(tr: BFMetaNodeSDK.Basic.TransactionJSON): Promise<BFMetaNodeSDK.ApiReturn<BFMetaNodeSDK.Basic.TransactionJSON>> {
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const result = await maker.transaction.broadcastTransaction({ transaction: tr });
        if (result.success) {
            return { success: true, result: tr };
        }
        // maker广播交易暂时无法返回failReason，先还原成由sdk广播交易
        // const result = await this.baseApi.sdk.api.transaction.broadcastCompleteTransaction<BFMetaNodeSDK.Basic.TransactionJSON>(tr);
        return result;
    }

    async broadcastTransaction(tr: BcfBroadcastTransactionReqDto): Promise<BFMetaNodeSDK.ApiReturn<BFMetaNodeSDK.Basic.TransactionJSON>> {
        const result = await this.sdkBroadcastTransaction(tr);
        if (result.success) {
            await this.createTransaction(tr);
        }
        return result;
    }

    async broadcastTransactionNotify(dto: BcfBroadcastTransactionNotifyReqDto): Promise<BFMetaNodeSDK.ApiReturn<BFMetaNodeSDK.Basic.TransactionJSON>> {
        const { fromAddress, toAddress, amount, trsInfo, notifyUrl } = dto;
        this.notifyService.checkNotifyParam(dto, this.chainName);
        const result = await this.sdkBroadcastTransaction(trsInfo.info.trs);
        if (result.success) {
            await this.createTransaction(
                trsInfo.info.trs,
                undefined,
                {
                    chainName: trsInfo.chain,
                    trSignature: trsInfo.info.trs.signature,
                    notifyUrl,
                    fromAddress,
                    toAddress,
                    amount,
                },
                dto.customParamString,
            );
        }
        return result;
    }

    async sdkCreateTransferAsset(argv: BFMetaNodeSDK.Transaction.TransferAssetTransactionParams) {
        if (argv.remark) {
            argv.remark.from = `${PROJECT_NAME}-${VERSION}`;
        } else {
            argv.remark = {
                from: `${PROJECT_NAME}-${VERSION}`,
            };
        }
        return await this.baseApi.sdk.api.transaction.createTransferAsset(argv);
    }

    async sdkPackageTransferAsset(argv: BFMetaNodeSDK.Transaction.PackageTransacationParams) {
        return await this.baseApi.sdk.api.transaction.packageTransferAsset(argv);
    }

    async broadcastTransferAsset(argv: BFMetaNodeSDK.Transaction.BroadcastTransacationParams) {
        const result = await this.__sdkBroadcastTransferAsset(argv);
        if (result.success) {
            await this.createTransaction(result.result);
        }
        return result;
    }

    private async __sdkBroadcastTransferAsset(argv: BFMetaNodeSDK.Transaction.BroadcastTransacationParams) {
        const result = await this.baseApi.sdk.api.transaction.broadcastTransferAsset<BFMetaNodeSDK.Basic.TransactionJSON>(argv);
        return result;
    }

    async sdkCreateSignature(argv: BFMetaNodeSDK.Transaction.SignatureTransactionParams) {
        if (argv.remark) {
            argv.remark.from = `${PROJECT_NAME}-${VERSION}`;
        } else {
            argv.remark = {
                from: `${PROJECT_NAME}-${VERSION}`,
            };
        }
        return await this.baseApi.sdk.api.transaction.createSignature(argv);
    }

    async sdkPackageSignature(argv: BFMetaNodeSDK.Transaction.PackageTransacationParams) {
        return await this.baseApi.sdk.api.transaction.packageSignature(argv);
    }

    async broadcastSignature(argv: BFMetaNodeSDK.Transaction.BroadcastTransacationParams) {
        const result = await this.__sdkBroadcastSignature(argv);
        if (result.success) {
            await this.createTransaction(result.result);
        }
        return result;
    }

    private async __sdkBroadcastSignature(argv: BFMetaNodeSDK.Transaction.BroadcastTransacationParams) {
        const result = await this.baseApi.sdk.api.transaction.broadcastSignature<BFMetaNodeSDK.Basic.TransactionJSON>(argv);
        return result;
    }

    async getAddressBalance(dto: BcfGetAddressBalanceReqDto) {
        return await this.baseApi.getAddressBalance(dto.address, (await this.getGenesisAssetInfo()).magic, dto.assetType);
    }

    async getAccountInfo(address: string) {
        return await this.baseApi.getAccountInfo(address);
    }

    async getBlockAverageFee() {
        return await this.baseApi.getBlockAverageFee();
    }

    async getAccountAsset(address: string) {
        return await this.baseApi.getAccountAsset(address);
    }

    async getAssets(dto: BcfGetAssetsReqDto) {
        return await this.baseApi.getAssets(dto.page, dto.pageSize, dto.assetType);
    }

    async getAssetDetails(assetType: string) {
        return await this.baseApi.getAssetDetails(assetType);
    }

    async getAllAccountAsset(opt: BFChainWallet.BCF.GetAllAccountAssetReq) {
        return await this.baseApi.getAllAccountAsset(opt);
    }

    async getPendingTransaction(dto: BcfGetPendingTrReqDto): Promise<InternalTransactionBase[]> {
        const { senderId, sort } = dto;
        const whereOptions: FindOptionsWhere<InternalTransactionBase> = {
            state: In([InternalTransStateID.INIT, InternalTransStateID.WAIT_ON_CHAIN]),
        };
        if (senderId) {
            whereOptions.senderId = senderId;
        }
        const options: FindManyOptions<InternalTransactionBase> = {
            where: whereOptions,
        };
        if (sort) {
            options.order = { createdTime: sort };
        }
        return await this.repository.find(options);
    }

    /**
     * 校验手续费
     * @param address
     * @param fee
     */
    private async __verifyFee(address: string, fee: string) {
        // 校验余额必须大于手续费
        const assetType = ChainHelper.getInternalMainAssetType(this.chainName, staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET);
        const result = await this.getAddressBalance({ address, assetType });
        if (!result.success) {
            throw Error(`address:${address} getAddressBalance fail`);
        }
        if (BigInt(result.result.amount) < BigInt(fee)) {
            throw Error(`[${this.chainName}] address:${address} assetType:${assetType} balance:${result.result.amount} is less than fee:${fee}`);
        }
    }

    /**
     * 生成权益转移交易
     * @param dto
     * @returns
     */
    async createTransferAsset(dto: CreateInternalTransferAssetReqDto): Promise<InternalTransactionBase> {
        const { secret, assetType, amount, param } = dto;
        const address = await bfmetaSignUtil.getAddressFromSecret(secret);
        const result = await this.getAddressBalance({ address, assetType });
        if (!result.success) {
            throw Error(`address:${address} getAddressBalance fail`);
        }
        if (BigInt(result.result.amount) < BigInt(amount)) {
            throw Error(`[${this.chainName}] address:${address} assetType:${assetType} balance:${result.result.amount} is less than amount:${amount}`);
        }
        // 预先生成交易体
        const trJson = await this.__generateTransferAssetTrJson(dto);
        // 校验余额必须大于手续费
        await this.__verifyFee(address, trJson.fee);
        // 创建链上交易
        return await this.createTransaction(trJson, param);
    }

    /**
     * 生成权益转移交易体
     * @param dto
     * @returns
     */
    private async __generateTransferAssetTrJson(dto: CreateInternalTransferAssetReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, assetType, amount, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.TransferAssetTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            assetInfo: {
                assetType,
                // 支付账户的金额
                amount,
            },
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        // const tempRet = await maker.transaction.generateTransferAsset(data);
        // if (!tempRet.success) {
        //     throw tempRet;
        // }
        // 转账先固定手续费
        // const minFeeRet = await maker.common.calcTransactionMinFee({ transaction: tempRet.result });
        // if (!minFeeRet.success) {
        //     throw minFeeRet;
        // }
        // data.fee = minFeeRet.result.minFee;
        const realRet = await maker.transaction.generateTransferAsset(data);
        if (!realRet.success) {
            throw realRet;
        }
        return realRet.result;
    }

    /**
     * 生成发行权益交易
     * @param dto
     * @returns
     */
    async createIssueAsset(dto: CreateInternalIssueAssetReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateIssueAssetTrJson(dto);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成发行权益交易体
     * @param dto
     * @returns
     */
    private async __generateIssueAssetTrJson(dto: CreateInternalIssueAssetReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, assetInfo, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.IssueAssetTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            assetInfo,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const ret = await maker.transaction.generateIssueAsset(data);
        if (!ret.success) {
            throw ret;
        }
        return ret.result;
    }

    /**
     * 生成增发权益交易
     * @param dto
     * @returns
     */
    async createIncreaseAsset(dto: CreateInternalIncreaseAssetReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateIncreaseAssetTrJson(dto);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成增发权益交易体
     * @param dto
     * @returns
     */
    private async __generateIncreaseAssetTrJson(dto: CreateInternalIncreaseAssetReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, assetInfo, frozenMainAssetPrealnum, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.IncreaseAssetTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            assetInfo,
            frozenMainAssetPrealnum: frozenMainAssetPrealnum ?? "0",
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const ret = await maker.transaction.generateIncreaseAsset(data);
        if (!ret.success) {
            throw ret;
        }
        return ret.result;
    }

    /**
     * 生成销毁权益交易
     * @param dto
     * @returns
     */
    async createDestroyAsset(dto: CreateInternalDestroyAssetReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateDestroyAssetTrJson(dto);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成销毁权益交易体
     * @param dto
     * @returns
     */
    private async __generateDestroyAssetTrJson(dto: CreateInternalDestroyAssetReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, assetInfo, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.DestroyAssetTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            assetInfo,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const ret = await maker.transaction.generateDestroyAsset(data);
        if (!ret.success) {
            throw ret;
        }
        return ret.result;
    }

    /**
     * 生成质押权益交易
     * @param dto
     * @returns
     */
    async createStakeAsset(dto: CreateInternalStakeAssetReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateStakeAssetTrJson(dto);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成质押权益交易体
     * @param dto
     * @returns
     */
    private async __generateStakeAssetTrJson(dto: CreateInternalStakeAssetReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { chainName, secret, assetInfo, stakeId, numberOfUnstakeHeight, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.StakeAssetTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            assetInfo,
            stakeId,
            numberOfUnstakeHeight,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const ret = await maker.transaction.generateStakeAsset(data);
        if (!ret.success) {
            throw ret;
        }
        return ret.result;
    }

    /**
     * 生成解除质押权益交易
     * @param dto
     * @returns
     */
    async createUnstakeAsset(dto: CreateInternalUnstakeAssetReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateUnstakeAssetTrJson(dto);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成解除质押权益交易体
     * @param dto
     * @returns
     */
    private async __generateUnstakeAssetTrJson(dto: CreateInternalUnstakeAssetReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, assetInfo, stakeId, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.UnstakeAssetTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            assetInfo,
            stakeId,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const ret = await maker.transaction.generateUnstakeAsset(data);
        if (!ret.success) {
            throw ret;
        }
        return ret.result;
    }

    /**
     * 生成发行非同质资产交易
     * @param dto
     * @returns
     */
    async createIssueEntityFactory(dto: CreateIssueEntityFactoryReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateIssueEntityFactoryTrJson(dto);
        // 校验余额必须大于手续费
        const address = await bfmetaSignUtil.getAddressFromSecret(dto.secret);
        await this.__verifyFee(address, trJson.fee);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成发行非同质资产交易体
     * @param dto
     * @returns
     */
    private async __generateIssueEntityFactoryTrJson(dto: CreateIssueEntityFactoryReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, issueFactoryInfo, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.IssueEntityFactoryTransactionV1Params = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            factoryInfo: issueFactoryInfo,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const tempRet = await maker.transaction.generateIssueEntityFactoryV1(data);
        if (!tempRet.success) {
            throw tempRet;
        }
        const minFeeRet = await maker.common.calcTransactionMinFee({ transaction: tempRet.result });
        if (!minFeeRet.success) {
            throw minFeeRet;
        }
        data.fee = minFeeRet.result.minFee;
        const realRet = await maker.transaction.generateIssueEntityFactoryV1(data);
        if (!realRet.success) {
            throw realRet;
        }
        return realRet.result;
    }

    /**
     * 生成发行非同质资产交易
     * @param dto
     * @returns
     */
    async createIssueEntity(dto: CreateIssueEntityReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateIssueEntityTrJson(dto);
        // 校验余额必须大于手续费
        const address = await bfmetaSignUtil.getAddressFromSecret(dto.secret);
        await this.__verifyFee(address, trJson.fee);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成发行非同质资产交易体
     * @param dto
     * @returns
     */
    private async __generateIssueEntityTrJson(dto: CreateIssueEntityReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, issueEntityInfo, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.IssueEntityTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            entityInfo: issueEntityInfo,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const tempRet = await maker.transaction.generateIssueEntity(data);
        if (!tempRet.success) {
            throw tempRet;
        }
        const minFeeRet = await maker.common.calcTransactionMinFee({ transaction: tempRet.result });
        if (!minFeeRet.success) {
            throw minFeeRet;
        }
        data.fee = minFeeRet.result.minFee;
        const realRet = await maker.transaction.generateIssueEntity(data);
        if (!realRet.success) {
            throw realRet;
        }
        return realRet.result;
    }

    /**
     * 生成批量发行非同质资产交易
     * @param dto
     * @returns
     */
    async createIssueEntityMulti(dto: CreateIssueEntityMultiReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateIssueEntityMultiTrJson(dto);
        // 校验余额必须大于手续费
        const address = await bfmetaSignUtil.getAddressFromSecret(dto.secret);
        await this.__verifyFee(address, trJson.fee);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成批量发行非同质资产交易体
     * @param dto
     * @returns
     */
    private async __generateIssueEntityMultiTrJson(dto: CreateIssueEntityMultiReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, issueEntityInfo, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.IssueEntityMultiTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            entityInfo: issueEntityInfo,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const tempRet = await maker.transaction.generateIssueEntityMulti(data);
        if (!tempRet.success) {
            throw tempRet;
        }
        const minFeeRet = await maker.common.calcTransactionMinFee({ transaction: tempRet.result });
        if (!minFeeRet.success) {
            throw minFeeRet;
        }
        data.fee = minFeeRet.result.minFee;
        const realRet = await maker.transaction.generateIssueEntityMulti(data);
        if (!realRet.success) {
            throw realRet;
        }
        return realRet.result;
    }

    /**
     * 生成转移资产交易
     * @param dto
     * @returns
     */
    async createTransferEntity(dto: CreateTransferEntityReqDto): Promise<InternalTransactionBase> {
        // 预先生成交易体
        const trJson = await this.__generateTranfserEntityTrJson(dto);
        // 创建链上交易
        return await this.createTransaction(trJson, dto.param);
    }

    /**
     * 生成转移资产交易体
     * @param dto
     * @returns
     */
    private async __generateTranfserEntityTrJson(dto: CreateTransferEntityReqDto): Promise<TransactionMaker.TransactionJSON<any>> {
        const { secret, recipientId, entityId, taxInformation, param, secondSecretInfo, remark, fee } = dto;
        const data: TransactionMaker.Transaction.TransferAnyTransactionParams = {
            // 私钥
            secret,
            secondSecretInfo,
            // 接受方账户
            recipientId,
            // 手续费
            fee: fee ?? DEFAULT_FEE,
            applyBlockHeight: await this.getRemoteLastBlockHeight(),
            numberOfEffectiveBlocks: NUMBER_OF_EFFECTIVE_BLOCKS,
            remark: Object.assign(param ? { orderId: param.linkId } : {}, remark),
            assetInfo: {
                parentAssetType: PARENT_ASSET_TYPE.ENTITY,
                assetType: entityId,
                amount: "1",
            },
            taxInformation,
        };
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const tempRet = await maker.transaction.generateTransferAny(data);
        if (!tempRet.success) {
            throw tempRet;
        }
        const minFeeRet = await maker.common.calcTransactionMinFee({ transaction: tempRet.result });
        if (!minFeeRet.success) {
            throw minFeeRet;
        }
        data.fee = minFeeRet.result.minFee;
        const realRet = await maker.transaction.generateTransferAny(data);
        if (!realRet.success) {
            throw realRet;
        }
        return realRet.result;
    }

    /**
     * 创建链上交易
     * @param trJson
     * @param param
     * @returns
     */
    async createTransaction<T extends InternalTransactionBase>(
        trJson: BFMetaNodeSDK.Basic.TransactionJSON,
        param?: WalletTypings.Entity.BusinessParam,
        notify?: WalletCore.Notify.SaveNotifyParam,
        customParamString?: string,
    ) {
        if (!trJson.signature) {
            throw new Error(`[${this.chainName}] createTransaction signature is undefined`);
        }
        const trans = this.newTransaction() as T;
        trans.chainName = this.chainName;
        trans.signature = trJson.signature;
        trans.senderId = trJson.senderId;
        trans.recipientId = trJson.recipientId;
        trans.type = trJson.type;
        trans.createTimestamp = trJson.timestamp;
        trans.applyBlockHeight = trJson.applyBlockHeight;
        trans.effectiveBlockHeight = trJson.effectiveBlockHeight;
        trans.state = InternalTransStateID.INIT;
        trans.trJson = trJson;
        if (param) {
            trans.mqId = param.mqId;
            trans.linkType = param.linkType;
            trans.linkId = param.linkId;
        }
        if (notify) {
            await this.notifyService.saveNotify(notify, customParamString);
        }
        await this.repository.save(trans);
        return trans;
    }

    async getTransactionMinFeePerByte() {
        return await this.baseApi.sdk.api.basic.getTransactionMinFeePerByte();
    }

    /**
     * 生成投票交易体
     */
    async generateVoteTrJson(data: TransactionMaker.Transaction.VoteTransactionParams): Promise<TransactionMaker.TransactionJSON<any>> {
        const maker = await transactionMaker.getTrMaker(this.chainName);
        const result = await maker.transaction.generateVote(data);
        if (!result.success) {
            throw result;
        }
        return result.result;
    }
}
