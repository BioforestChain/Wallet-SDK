import { ApiProperty } from "@nestjs/swagger";
import { IsPositive, IsString, Min } from "class-validator";

export class BcfGetAssetsReqDto implements WalletTypings.Bcf.Api.BcfGetAssetsReqDto {
    @IsPositive()
    @Min(1)
    @ApiProperty({ description: "page", default: 1 })
    page: number;

    @IsPositive()
    @Min(1)
    @ApiProperty({ description: "pageSize", default: 10 })
    pageSize: number;

    @ApiProperty({ description: "查询资产名称(模糊匹配)" })
    assetType?: string;
}
