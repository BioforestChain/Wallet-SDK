import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min } from "class-validator";

export class TokenInfoListReqDto implements WalletTypings.Eth.Api.TokenInfoListReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "归属链", enum: ExternalChainName })
    chain: ExternalChainName;

    @Min(1)
    @ApiProperty({ description: "page", default: 1, required: false })
    page: number;

    @Min(1)
    @Max(200)
    @ApiProperty({
        description: "pageSize",
        default: 20,
        required: false,
    })
    pageSize: number;

    @ApiProperty({ description: "搜索关键字", required: false })
    keywords: string;

    @ApiProperty({ description: "合约地址", required: false })
    contractAddress: string;
}
