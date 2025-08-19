import { ApiProperty } from "@nestjs/swagger";
import { ERC20BalanceItem, EthAccountBalanceV2ReqDto } from "../../eth/dto/index.js";

export class TronAccountResDto implements WalletTypings.Tron.Api.TronGetAccountResDto {
    @ApiProperty({ description: "账户是否激活" })
    active!: boolean;
    @ApiProperty({ description: "账户具体信息(账户未激活时，此字段不返回)" })
    account?: {
        /** 账户地址，Base58check */
        address: string;
        /** 账户地址，HEX格式  */
        addressHex: string;
        /** 账户余额, 比例 1000000:1 */
        balance: number;
    };
}

export class TronAccountBalanceV2ReqDto extends EthAccountBalanceV2ReqDto implements WalletTypings.Tron.Api.TronAccountBalanceV2ReqDto {}

export class TronAccountResourceResDto implements WalletTypings.Tron.Api.TronGetAccountResourceResDto {
    @ApiProperty({ description: "免费带宽总量" })
    freeNetLimit?: number;

    @ApiProperty({ description: "已使用的免费带宽" })
    freeNetUsed?: number;

    @ApiProperty({ description: "已使用的通过质押获得的带宽" })
    NetUsed?: number;

    @ApiProperty({ description: "质押获得的带宽总量" })
    NetLimit?: number;

    @ApiProperty({ description: "拥有的投票权" })
    tronPowerLimit?: number;

    @ApiProperty({ description: "已使用的能量" })
    EnergyUsed?: number;

    @ApiProperty({ description: "质押获取的总能量" })
    EnergyLimit?: number;

    @ApiProperty({ description: "全网通过质押获取的带宽总量" })
    TotalNetLimit?: number;

    @ApiProperty({ description: "全网用于获取带宽的质押TRX总量" })
    TotalNetWeight?: number;

    @ApiProperty({ description: "全网通过质押获取的能量总量" })
    TotalEnergyLimit?: number;

    @ApiProperty({ description: "全网用于获取能量的质押TRX总量" })
    TotalEnergyWeight?: number;
}

export class TRC20BalanceItem extends ERC20BalanceItem {}
