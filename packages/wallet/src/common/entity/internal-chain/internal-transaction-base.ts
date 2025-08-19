import type { InternalChainName, InternalTransStateID } from "@bnqkl/wallet-typings";
import { Column } from "typeorm";
import { ChainTransEntity } from "../chain-trans.entity.js";

export abstract class InternalTransactionBase
    extends ChainTransEntity<InternalTransStateID, InternalChainName, BFMetaNodeSDK.Basic.TransactionJSON>
    implements WalletTypings.InternalChain.TransactionBase
{
    /** 交易类型 */
    @Column("varchar")
    type!: string;
    /** 发送者地址 */
    @Column("varchar", { name: "sender_id" })
    senderId!: string;
    /** 接受者地址 */
    @Column("varchar", { name: "recipient_id" })
    recipientId?: string;
    /** 交易签名 */
    @Column("varchar", { unique: true })
    signature!: string;
    /** 事件创建时间戳 */
    @Column("int", { name: "create_timestamp" })
    createTimestamp!: number;
    /** 事件发起高度 */
    @Column("int", { name: "apply_block_height" })
    applyBlockHeight!: number;
    /** 事件失效高度 */
    @Column("int", { name: "effective_block_height" })
    effectiveBlockHeight!: number;
    /** 上链高度时间戳 */
    @Column("int", { name: "onchain_timestamp" })
    onChainTimestamp!: number;
    /** 成功确认高度 */
    @Column("int", { name: "success_height" })
    successHeight!: number;
    /** 失败确认高度 */
    @Column("int", { name: "fail_height" })
    failHeight!: number;
    /** 重试广播次数 */
    @Column("smallint", { name: "retry_broadcast_num", default: 0 })
    retryBroadcastNum!: number;
}
