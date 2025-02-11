import { Column, Entity } from "typeorm";
import { FSMEntity, RMB_PAY_PLATFORM, RMB_TRANS_STATE_ID } from "@bnqkl/wallet-sdk";

@Entity("rmb_transactions")
export class RmbTransactions extends FSMEntity<RMB_TRANS_STATE_ID> implements WalletTypings.Rmb.TransactionBase {
    /**支付平台交易id */
    @Column("varchar", { name: "platform_tx_id" })
    platformTxId: string;

    /**支付平台 */
    @Column("smallint", { name: "platform" })
    platform: RMB_PAY_PLATFORM;

    /**用户id */
    @Column("varchar", { name: "user_id" })
    userId: string;

    /**交易金额 */
    @Column("varchar", { name: "amount" })
    amount: string;

    /**失败原因 */
    @Column("varchar", { name: "fail_reason" })
    failReason?: string;

    /**消息队列id */
    @Column("varchar", { name: "mq_id" })
    mqId?: string;

    /** 关联业务表类型 */
    @Column("tinyint", { name: "link_type" })
    linkType?: number;

    /** 关联业务表编号 */
    @Column("varchar", { name: "link_id" })
    linkId?: string;
}
