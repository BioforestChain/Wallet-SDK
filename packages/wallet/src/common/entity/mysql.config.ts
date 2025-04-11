import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { staticConfig } from "../../config";
import { ContractTokenInfo } from "./contract-token-info.entity";
import { TronTransactions, EthTransactions, BscTransactions } from "./external-chain";
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
} from "./internal-chain";
import { RmbTransactions } from "./rmb-transaction.entity";
import { AirdropOrder, AirdropTransferTx } from "./airdrop";
import { NotifyEntity } from "./notify.entity";

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
