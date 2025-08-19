import { InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取内链所有账户余额 */
export class GetInternalAccountsBalanceReqDto implements WalletTypings.InternalChain.Api.GetInternalAccountsBalanceReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName!: InternalChainName;
    @ApiProperty({ description: "过滤条件" })
    filter!: BFChainWallet.BCF.GetAllAccountAssetReq;
}
