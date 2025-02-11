import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AirdropRetryIssueTxOnChainReqDto implements WalletTypings.Airdrop.Api.AirdropRetryIssueTxOnChainReqDto {
    @ApiProperty({ description: "订单id" })
    @IsString()
    orderId!: string;
}
