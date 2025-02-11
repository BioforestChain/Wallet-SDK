import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EthBaseReqDto implements WalletTypings.Eth.Api.EthBaseReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "用户地址" })
    address: string;
}

export class EthQueryTransReqDto implements WalletTypings.Eth.Api.EthQueryTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "交易哈希" })
    txHash: string;
}
