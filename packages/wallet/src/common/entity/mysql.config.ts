import type { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { staticConfig } from "../../config/index.js";
import { ContractTokenInfo } from "./contract-token-info.entity.js";
import { TronTransactions, EthTransactions, BscTransactions } from "./external-chain/index.js";
import {
    CcchainTransactions,
    BfmchainTransactions,
    PMChainTransactions,
    ETHMetaTransactions,
    BFChainV2Transactions,
    BTGMetaTransactions,
    BTCMetaTransactions,
    BIWMetaTransactions,
    MalibuTransactions,
} from "./internal-chain/index.js";
import { RmbTransactions } from "./rmb-transaction.entity.js";
import { AirdropOrder, AirdropTransferTx } from "./airdrop/index.js";
import { NotifyEntity } from "./notify.entity.js";

const { host, port, username, password, dbName } = staticConfig.mysql;
export const mysqlConfig: TypeOrmModuleAsyncOptions = {
    useFactory: () => ({
        type: "mysql",
        host,
        port,
        username,
        password,
        database: dbName,
        entities: [
            CcchainTransactions,
            BfmchainTransactions,
            TronTransactions,
            EthTransactions,
            BscTransactions,
            PMChainTransactions,
            ContractTokenInfo,
            ETHMetaTransactions,
            BFChainV2Transactions,
            BTGMetaTransactions,
            BTCMetaTransactions,
            BIWMetaTransactions,
            MalibuTransactions,
            RmbTransactions,
            AirdropOrder,
            AirdropTransferTx,
            NotifyEntity,
        ],

        maxQueryExecutionTime: 500,
        bigNumberStrings: false,
    }),
};
