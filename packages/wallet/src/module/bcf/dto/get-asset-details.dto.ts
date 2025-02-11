import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BcfGetAssetDetailsReqDto implements WalletTypings.Bcf.Api.BcfGetAssetDetailsReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "资产标识" })
    assetType: string;
}
