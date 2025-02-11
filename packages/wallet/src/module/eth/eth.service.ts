import { BaseRepository, ExternalChainName, memTimeCache, MEM_TIME_CACHE_STRATEGY } from "@bnqkl/wallet-sdk";
import { Inject, Injectable } from "@nestjs/common";
import { EthTransactions, API_SCAN_SORT_ENUM } from "../../common";
import { externalChainHelper, walletSdk } from "../../helper";
import { DataSource } from "typeorm";
import { EthAccountBalanceResDto, EthSendSignTransReqDto, EthTransHistoryReqDto } from "./dto";
import { EthServiceBase } from "./eth-base.service";

@Injectable()
export class EthTransactionRepository extends BaseRepository<EthTransactions> {
    constructor(dataSource: DataSource) {
        super(EthTransactions, dataSource);
    }
}

@Injectable()
export class EthService extends EthServiceBase {
    @Inject(EthTransactionRepository)
    public readonly repository: EthTransactionRepository;

    constructor() {
        super(ExternalChainName.ETH);
    }

    get baseApi() {
        return walletSdk.walletFactory.EthApi;
    }

    newTransaction() {
        return new EthTransactions();
    }

    /**
     * 获取打块间隔
     */
    getForgeInterval(): number {
        return 15;
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.FOREVER })
    getChainId() {
        return super.getChainId();
    }

    /**
     * 获取交易序号
     * @param signTransData
     */
    getNonce(signTransData: string): number {
        return externalChainHelper.getEthNonce(signTransData);
    }

    getErc20TransHistory(dto: EthTransHistoryReqDto) {
        if (!dto?.sort) {
            dto.sort = API_SCAN_SORT_ENUM.DESC;
        }
        return this.baseApi.getErc20TransHistory(dto);
    }

    getTxHash(signTransData: string): string {
        const { txHash } = externalChainHelper.getEthTransDetail(signTransData);
        return txHash;
    }
}
