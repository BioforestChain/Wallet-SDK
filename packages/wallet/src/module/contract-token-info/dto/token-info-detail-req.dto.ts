import { CHAIN_ID } from "@bnqkl/wallet-sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TokenInfoDetailReqDto implements WalletTypings.Eth.Api.TokenInfoDetailReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "归属链", enum: CHAIN_ID })
    chain!: CHAIN_ID;

    @IsNotEmpty()
    @ApiProperty({ description: "合约标识" })
    symbol!: string;
}
