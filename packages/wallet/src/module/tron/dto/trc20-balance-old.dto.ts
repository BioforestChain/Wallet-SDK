import { ApiProperty } from "@nestjs/swagger";

export class TronBalanceReqDto implements WalletTypings.Tron.Api.TronBalanceReqDto {
    @ApiProperty({ description: "用户地址" })
    owner_address!: string;
    @ApiProperty({ description: "合约地址" })
    contract_address!: string;
    @ApiProperty({
        description: "账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址",
        default: false,
        required: false,
    })
    visible?: boolean;
    @ApiProperty({
        description: "用户的hex地址，visible为true时，必须要有",
        required: false,
    })
    hex_address?: string;

    @ApiProperty({ description: "交易详情" })
    asset?: {
        name: string;
        decimal: number;
    };
}

export class Trc20BalanceResDto implements WalletTypings.Tron.Api.TronBalanceResDto {
    @ApiProperty({ description: "用户地址" })
    owner_address!: string;

    @ApiProperty({ description: "合约地址" })
    contract_address!: string;

    @ApiProperty({ description: "合约余额", default: 0 })
    balance!: number;

    @ApiProperty({ description: "合约代币精度(只有余额不为0时显示)", default: 0 })
    decimal!: number;
}
