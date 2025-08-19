import { Column, Entity } from "typeorm";
import { ExternalTransactionBase } from "./external-transaction-base.js";
@Entity("eth_transactions")
export class EthTransactions extends ExternalTransactionBase<WalletTypings.ExternalChain.EthTrJson> {
    @Column("varchar")
    fee: string;

    @Column("int")
    nonce: number;
}
