import { ApiProperty } from "@nestjs/swagger";

export class Erc20BalanceResDto implements WalletTypings.Eth.Api.Erc20BalanceResDto {
    @ApiProperty({ description: "合约余额" })
    balance: string;

    @ApiProperty({ description: "合约精度" })
    decimal: number;
}
