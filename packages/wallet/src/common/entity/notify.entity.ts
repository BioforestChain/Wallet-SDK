import { Column, Entity } from "typeorm";
import { BaseEntity, ExternalChainName, InternalChainName } from "@bnqkl/wallet-sdk";
import { NotifyResult } from "@bnqkl/wallet-core";

@Entity("notify")
export class NotifyEntity extends BaseEntity {
    @Column({ name: "chain_name", comment: "链名" })
    chainName: ExternalChainName | InternalChainName;
    @Column({ name: "signature", comment: "签名" })
    signature: string;
    @Column({ name: "sign_time", comment: "签名时间" })
    signTime: number;
    @Column({ name: "tr_signature", comment: "交易签名" })
    trSignature: string;
    @Column({ name: "notify_url", comment: "通知url" })
    notifyUrl: string;
    @Column({ name: "from_address", comment: "发起地址" })
    fromAddress: string;
    @Column({ name: "to_address", comment: "接收地址" })
    toAddress: string;
    @Column({ name: "amount", comment: "金额" })
    amount: string;
    @Column({ name: "tid", comment: "tid" })
    tid: string;
    @Column({ name: "notify_result", comment: "通知结果" })
    notifyResult: NotifyResult;
    /** 重试次数 */
    @Column("smallint", { name: "retry_num", default: 0 })
    retryNum: number;
}
