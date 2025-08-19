import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AirdropRecordDetailReqDto implements WalletTypings.Airdrop.Api.AirdropRecordDetailReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "订单id" })
    orderId!: string;
}
