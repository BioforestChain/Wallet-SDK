import { InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取内链账户余额 */
export class GetInternalAccountBalanceReqDto implements WalletTypings.InternalChain.Api.GetInternalAccountBalanceReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "用户地址" })
    address: string;

    @IsNotEmpty()
    @ApiProperty({ description: "资产类型" })
    assetType: string;
}

/**获取内链账户余额 */
export class GetInternalAssetDetailsReqDto implements WalletTypings.InternalChain.Api.GetAssetDetailsReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "资产类型" })
    assetType: string;
}
