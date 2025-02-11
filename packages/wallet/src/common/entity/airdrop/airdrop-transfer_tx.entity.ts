import { BaseEntity } from "@bnqkl/wallet-sdk";
import { Column, Entity } from "typeorm";

@Entity("wallet_airdrop_transfer_tx")
export class AirdropTransferTx extends BaseEntity {
    /**订单id */
    @Column("varchar", { name: "order_id" })
    orderId: string;

    /**dp编号 */
    @Column("smallint", { name: "dp_no" })
    dpNo: number;

    /**dp转移地址 */
    @Column("varchar", { name: "address" })
    address: string;

    /**空投转移交易id */
    @Column("varchar", { name: "transfer_tx_id" })
    transferTxId: string;

    /**转移交易已上链 */
    @Column("boolean", { name: "transfer_tx_onchain" })
    transferTxOnchain: boolean;
}
