import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TronTransReceiptReqDto implements WalletTypings.Tron.Api.TronReceiptTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: " 交易ID" })
    txId!: string;
}
