import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AirdropRetryTransferTxOnChainReqDto implements WalletTypings.Airdrop.Api.AirdropRetryTransferTxOnChainReqDto {
    @ApiProperty({ description: "订单id" })
    @IsString()
    orderId!: string;
}
