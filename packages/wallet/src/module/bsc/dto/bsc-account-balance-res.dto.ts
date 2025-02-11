import { ApiProperty } from "@nestjs/swagger";
import { ERC20BalanceItem } from "../../eth/dto";

export class BscAccountBalanceResDto  {
    @ApiProperty({ description: "BNB余额" })
    balance: string;

    @ApiProperty({ description: "BEP20余额" })
    BEP20Balance: BEP20BalanceItem[];
}

export class BEP20BalanceItem extends ERC20BalanceItem {}
