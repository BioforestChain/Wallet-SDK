import { InternalChainName } from "@bnqkl/wallet-sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsNumber } from "class-validator";
import { Type } from "class-transformer";

/**获取内链最新区块 */
export class GetInternalLastBlockReqDto implements WalletTypings.InternalChain.Api.GetInternalLastBlockReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名" })
    chainName: InternalChainName;
}

/**获取内链区块 */
export class GetInternalBlockReqDto implements WalletTypings.InternalChain.Api.GetInternalBlockReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名" })
    chainName: InternalChainName;

    @IsOptional()
    @ApiProperty({ description: "交易签名", required: false })
    signature?: string;

    @IsOptional()
    @ApiProperty({ description: "区块高度", required: false })
    @Type(() => Number)
    height?: number;

    @IsOptional()
    @ApiProperty({ description: "第几页", default: 1, required: false })
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @ApiProperty({ description: "每页记录数", default: 10, maximum: 50, required: false })
    @IsNumber()
    @Type(() => Number)
    pageSize?: number;
}
