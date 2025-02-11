import { ExternalChainName, ExternalTransStateID } from "@bnqkl/wallet-typings";
import { Column } from "typeorm";
import { ChainTransEntity } from "../chain-trans.entity";

export abstract class ExternalTransactionBase<TrJsonType extends object = {}>
    extends ChainTransEntity<ExternalTransStateID, ExternalChainName, TrJsonType>
    implements WalletTypings.ExternalChain.TransactionBase<TrJsonType>
{
    /**交易Hash */
    @Column({ name: "tx_hash" })
    txHash: string;
    /**交易体已广播 */
    @Column("tinyint", { name: "is_broadcasted" })
    isBroadcasted: boolean;
    /**发起地址 */
    @Column()
    from: string;
    /**接收地址 */
    @Column()
    to: string;
    /**交易金额 */
    @Column()
    value: string;
    /**资产标识 */
    @Column({ name: "asset_symbol" })
    assetSymbol: string;
    /**合约地址 */
    @Column({ name: "contract_address" })
    contractAddress?: string;
}
