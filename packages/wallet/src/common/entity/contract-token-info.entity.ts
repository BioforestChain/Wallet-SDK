import type { ExternalChainName } from "@bnqkl/wallet-sdk";
import { BaseEntity } from "@bnqkl/wallet-sdk";
import { Column, Entity } from "typeorm";

@Entity("contract_token_info")
export class ContractTokenInfo extends BaseEntity {
    @Column()
    chain!: ExternalChainName;

    @Column()
    address!: string;

    @Column()
    name!: string;

    @Column()
    icon!: string;

    @Column()
    symbol!: string;

    @Column("int")
    decimals!: number;

    @Column("varchar", { name: "total_supply" })
    totalSupply!: string;

    @Column()
    website!: string;

    @Column("datetime", { name: "publish_time" })
    publishTime!: Date;

    /**
     * 逻辑删除
     */
    @Column({ default: 0, select: false, name: "del_flag" })
    delFlag!: number;
}
