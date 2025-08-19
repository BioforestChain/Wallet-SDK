import { Column, Entity } from "typeorm";
import { EthTransactions } from "./eth-transaction.entity.js";

@Entity("bsc_transactions")
export class BscTransactions extends EthTransactions {}
