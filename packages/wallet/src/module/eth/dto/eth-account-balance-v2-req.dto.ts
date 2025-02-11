import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";
export class EthAccountBalanceV2ReqDto implements WalletTypings.Eth.Api.EthAccountBalanceV2ReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "用户地址" })
    address: string;

    @IsArray()
    @ApiProperty({ description: "合约地址列表" })
    contracts: string[];
}
