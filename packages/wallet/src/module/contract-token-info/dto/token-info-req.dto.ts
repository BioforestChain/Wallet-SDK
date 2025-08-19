import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取合约token信息 */
export class TokenInfoReqDto implements WalletTypings.ContractTokenInfo.Api.TokenInfoReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName!: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "合约地址" })
    contractAddress!: string;
}

export class TokenInfoByChainReqDto implements WalletTypings.ContractTokenInfo.Api.TokenInfoByChainReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName!: ExternalChainName;
}
