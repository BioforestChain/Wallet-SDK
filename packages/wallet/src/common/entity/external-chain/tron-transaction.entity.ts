import { Column, Entity } from "typeorm";
import { ExternalTransactionBase } from "./external-transaction-base.js";
@Entity("tron_transactions")
export class TronTransactions extends ExternalTransactionBase<BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction> {}
