import { Column } from "typeorm";
import { FSMEntity } from "@bnqkl/wallet-sdk";

export abstract class ChainTransEntity<TransStateID extends number, ChainName extends string, TrJsonType extends object = {}>
    extends FSMEntity<TransStateID>
    implements WalletTypings.Entity.ChainTransEntity<TransStateID, ChainName, TrJsonType>
{
    /**链名 */
    @Column("varchar", { name: "chain_name" })
    chainName: ChainName;

    /**交易体 */
    @Column("simple-json", { name: "tr_json" })
    trJson: TrJsonType;

    /** 失败原因 */
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
