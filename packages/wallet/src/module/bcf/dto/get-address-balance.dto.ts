import { ApiProperty } from "@nestjs/swagger";

export class BcfGetAddressBalanceReqDto implements WalletTypings.Bcf.Api.BcfGetAddressBalanceReqDto {
    @ApiProperty({ description: "地址" })
    address: string;
    @ApiProperty({ description: "资产类型" })
    assetType: string;
}
