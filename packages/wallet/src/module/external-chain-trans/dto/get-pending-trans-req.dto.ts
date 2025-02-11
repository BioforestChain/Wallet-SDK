import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetExternalPendingTransReqDto implements WalletTypings.Eth.Api.EthPendingTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "用户地址" })
    address: string;

    @ApiProperty({ description: "资产标识" })
    assetSymbol: string;
}
