import { BaseRepository, CHAIN_NETWORK_TYPE, ExternalChainName, memTimeCache, MEM_TIME_CACHE_STRATEGY } from "@bnqkl/wallet-sdk";
import { Inject, Injectable } from "@nestjs/common";
import { externalChainHelper, walletSdk } from "../../helper/index.js";
import type { DataSource } from "typeorm";
import { EthServiceBase } from "../eth/eth-base.service.js";
import type { BscTransHistoryReqDto } from "./dto/index.js";
import { BscAccountBalanceResDto } from "./dto/index.js";
import { BscTransactions } from "../../common/entity/index.js";
import { API_SCAN_SORT_ENUM } from "../../common/constants/index.js";
import { staticConfig } from "../../config/index.js";

@Injectable()
export class BscTransactionRepository extends BaseRepository<BscTransactions> {
    constructor(dataSource: DataSource) {
        super(BscTransactions, dataSource);
    }
}

@Injectable()
export class BscService extends EthServiceBase {
    @Inject(BscTransactionRepository)
    public readonly repository!: BscTransactionRepository;

    constructor() {
        super(ExternalChainName.BSC);
    }

    get baseApi() {
        return walletSdk.walletFactory.BscApi;
    }

    newTransaction() {
        return new BscTransactions();
    }

    /**
     * 查询外链交易回执次数限制
     */
    getMaxQueryCount(): number {
        return 250;
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
        return externalChainHelper.getBscNonce(signTransData);
    }

    getBep20TransHistory(dto: BscTransHistoryReqDto) {
        if (!dto?.sort) {
            dto.sort = API_SCAN_SORT_ENUM.DESC;
        }
        return this.baseApi.getBep20TransHistory(dto);
    }

    getTxHash(signTransData: string): string {
        const { txHash } = externalChainHelper.getBscTransDetail(signTransData);
        return txHash;
    }

    async getGasPrice() {
        const gasPrice = await super.getGasPrice();
        if (staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET) {
            // bsc外网测试环境的gasPrice调大2倍
            return (BigInt(gasPrice) * BigInt(2)).toString();
        }
        return gasPrice;
    }
}
