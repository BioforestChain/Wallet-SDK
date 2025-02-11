import { ApiProperty } from "@nestjs/swagger";

export class Erc20BalanceReqDto implements WalletTypings.Eth.Api.Erc20BalanceReqDto {
    @ApiProperty({ description: "用户地址" })
    address: string;

    @ApiProperty({ description: "合约地址" })
    contractAddress: string;
}
