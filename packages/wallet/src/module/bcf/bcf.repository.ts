import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import {
    BFChainV2Transactions,
    BfmchainTransactions,
    BfmetaV2Transactions,
    BIWMetaTransactions,
    BTCMetaTransactions,
    BTGMetaTransactions,
    CcchainTransactions,
    ETHMetaTransactions,
    PMChainTransactions,
} from "../../common";
import { BaseRepository } from "@bnqkl/wallet-sdk";

@Injectable()
export class BfmchainTransactionsRepository extends BaseRepository<BfmchainTransactions> {
    constructor(dataSource: DataSource) {
        super(BfmchainTransactions, dataSource);
    }
}

@Injectable()
export class BFChainV2TransactionsRepository extends BaseRepository<BFChainV2Transactions> {
    constructor(dataSource: DataSource) {
        super(BFChainV2Transactions, dataSource);
    }
}

@Injectable()
export class CcchainTransactionsRepository extends BaseRepository<CcchainTransactions> {
    constructor(dataSource: DataSource) {
        super(CcchainTransactions, dataSource);
    }
}

@Injectable()
export class PmchainTransactionsRepository extends BaseRepository<PMChainTransactions> {
    constructor(dataSource: DataSource) {
        super(PMChainTransactions, dataSource);
    }
}

@Injectable()
export class ETHMetaTransactionsRepository extends BaseRepository<ETHMetaTransactions> {
    constructor(dataSource: DataSource) {
        super(ETHMetaTransactions, dataSource);
    }
}

@Injectable()
export class BTCMetaTransactionsRepository extends BaseRepository<BTCMetaTransactions> {
    constructor(dataSource: DataSource) {
        super(BTCMetaTransactions, dataSource);
    }
}

@Injectable()
export class BTGMetaTransactionsRepository extends BaseRepository<BTGMetaTransactions> {
    constructor(dataSource: DataSource) {
        super(BTGMetaTransactions, dataSource);
    }
}

@Injectable()
export class BIWMetaTransactionsRepository extends BaseRepository<BIWMetaTransactions> {
    constructor(dataSource: DataSource) {
        super(BIWMetaTransactions, dataSource);
    }
}

@Injectable()
export class BfmetaV2TransactionsRepository extends BaseRepository<BfmetaV2Transactions> {
    constructor(dataSource: DataSource) {
        super(BfmetaV2Transactions, dataSource);
    }
}
