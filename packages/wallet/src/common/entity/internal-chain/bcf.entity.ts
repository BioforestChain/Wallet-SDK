import { Entity } from "typeorm";
import { InternalTransactionBase } from "./internal-transaction-base";

@Entity("bfmchain_transactions")
export class BfmchainTransactions extends InternalTransactionBase {}

@Entity("bfchainv2_transactions")
export class BFChainV2Transactions extends InternalTransactionBase {}

@Entity("ccchain_transactions")
export class CcchainTransactions extends InternalTransactionBase {}

@Entity("pmchain_transactions")
export class PMChainTransactions extends InternalTransactionBase {}

@Entity("ethmeta_transactions")
export class ETHMetaTransactions extends InternalTransactionBase {}

@Entity("btcmeta_transactions")
export class BTCMetaTransactions extends InternalTransactionBase {}

@Entity("btgmeta_transactions")
export class BTGMetaTransactions extends InternalTransactionBase {}

@Entity("biwmeta_transactions")
export class BIWMetaTransactions extends InternalTransactionBase {}

@Entity("bfmetachain_transactions")
export class BfmetaChainTransactions extends InternalTransactionBase {}
