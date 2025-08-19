import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取外链账户余额 */
export class GetExternalAccountBalanceReqDto implements WalletTypings.ExternalChain.Api.GetExternalAccountBalanceReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName!: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "用户地址" })
    address!: string;

    @IsNotEmpty()
    @ApiProperty({ description: "合约地址" })
    contractAddress!: string;
}

export class GetExternalBalanceReqDto implements WalletTypings.ExternalChain.Api.GetExternalBalanceReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName!: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "用户地址" })
    address!: string;
}
