import { Column, Entity } from "typeorm";
import { EthTransactions } from "./eth-transaction.entity";

@Entity("bsc_transactions")
export class BscTransactions extends EthTransactions {}
