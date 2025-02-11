import { ApiProperty } from "@nestjs/swagger";

export class EthAccountBalanceResDto {
    @ApiProperty({ description: "ETH余额" })
    balance: string;

    @ApiProperty({ description: "ERC20余额" })
    ERC20Balance: ERC20BalanceItem[];
}

export class ERC20BalanceItem implements WalletTypings.Eth.ERC20BalanceItem {
    contractAddress: string;
    amount: string;
    decimals: number;
    symbol: string;
    icon: string;
}
