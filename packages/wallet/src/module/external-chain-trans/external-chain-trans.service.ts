import { forwardRef, Inject } from "@nestjs/common";
import { ExternalTransactionBase } from "../../common/entity";
import { GetExternalPendingTransReqDto } from "./dto";
import { ContractTokenInfoService } from "../contract-token-info/contract-token-info.service";
import { ChainTransServiceBase } from "../../common/chain-trans/chain-trans-service";
import { ExternalChainName, ExternalTransStateID } from "@bnqkl/wallet-sdk";
import { In } from "typeorm";
import { NotifyService } from "../notify/notify.service";

export abstract class ExternalChainTransService extends ChainTransServiceBase<
    ExternalTransStateID,
    ExternalChainName,
    ExternalTransactionBase,
    Wallet.ExternalChainApiEvents
> {
    @Inject(forwardRef(() => ContractTokenInfoService))
    protected __contractTokenInfoService!: ContractTokenInfoService;
    @Inject(forwardRef(() => NotifyService))
    protected notifyService: NotifyService;
    constructor(chainName: ExternalChainName) {
        super(chainName);
    }

    abstract newTransaction(): ExternalTransactionBase;

    /**
     * 获取上链交易体信息
     * @param txHash
     */
    abstract getTransReceipt(txHash: string): Promise<{ blockNumber: number; status: boolean } | null | undefined>;

    /**
     * 检查是否过期
     * @param trans
     */
    async checkExpire(trans: ExternalTransactionBase): Promise<boolean> {
        return false;
    }

    /**
     * 获取打块间隔
     */
    getForgeInterval(): number {
        return 3;
    }

    /**
     * 获取下一个出块间隔
     */
    async getNextBlockInterval(): Promise<number> {
        return this.getForgeInterval();
    }

    /**
     * 查询外链交易回执次数限制
     */
    getMaxQueryCount(): number {
        return 50;
    }

    /**
     * 获取待上链的交易
     * @param dto
     * @returns
     */
    async getPendingTransaction(dto: GetExternalPendingTransReqDto): Promise<ExternalTransactionBase[]> {
        const { address, assetSymbol } = dto;
        return await this.repository.findBy({ from: address, assetSymbol, state: In([ExternalTransStateID.INIT, ExternalTransStateID.WAIT_ON_CHAIN]) });
    }

    /**
     * 创建链上交易
     * @param detail
     * @param txHash
     * @param param
     * @returns
     */
    protected async __createTransaction<T extends ExternalTransactionBase>(
        detail: WalletTypings.ExternalChain.ExternalTransDetail,
        txHash: string,
        param?: WalletTypings.Entity.BusinessParam,
    ) {
        if (!txHash) {
            throw new Error(`[${this.chainName}] __createTransaction txHash is undefined`);
        }
        const trans = this.newTransaction() as T;
        trans.chainName = this.chainName;
        trans.txHash = txHash;
        trans.state = ExternalTransStateID.INIT;
        trans.from = detail.from;
        trans.to = detail.to;
        trans.value = detail.amount;
        trans.assetSymbol = detail.assetSymbol;
        trans.contractAddress = detail.contract;
        if (param) {
            trans.mqId = param.mqId;
            trans.linkType = param.linkType;
            trans.linkId = param.linkId;
        }
        return trans;
    }
}
