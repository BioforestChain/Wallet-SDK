import { AIRDROP_ORDER_STATE_ID, AIRDROP_TYPE, FSMEntity, InternalChainName } from "@bnqkl/wallet-sdk";
import { Column, Entity } from "typeorm";

@Entity("wallet_airdrop_order")
export class AirdropOrder extends FSMEntity<AIRDROP_ORDER_STATE_ID> {
    /**空投类型 */
    @Column("smallint", { name: "type" })
    type: AIRDROP_TYPE;

    /**空投链名 */
    @Column("varchar", { name: "chain_name" })
    chainName: InternalChainName;

    /**dp发行信息 */
    @Column("simple-json", { name: "issue_dp_info" })
    issueDpInfo: WalletTypings.Airdrop.IssueDpInfo;

    /**空投发行交易id */
    @Column("varchar", { name: "issue_tx_id" })
    issueTxId: string;

    /**空投转移地址 */
    @Column("varchar", { name: "transfer_address" })
    transferAddress: string;

    /**空投转移交易id */
    @Column("varchar", { name: "transfer_tx_id" })
    transferTxId: string;

    /**消息队列id */
    @Column("varchar", { name: "mq_id" })
    mqId?: string;
}
