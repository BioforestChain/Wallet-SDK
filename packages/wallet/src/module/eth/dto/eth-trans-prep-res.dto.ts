import { ApiProperty } from "@nestjs/swagger";

export class EthTransPrepResDto implements WalletTypings.Eth.Api.EthTransPrepResDto {
    @ApiProperty({ description: "用户地址" })
    address!: string;

    @ApiProperty({ description: "交易类型" })
    type!: number;

    @ApiProperty({ description: "gasPrice" })
    gasPrice!: string;

    @ApiProperty({ description: "交易数" })
    txCount!: number;

    @ApiProperty({ description: "普通交易Gas，默认为0", default: 0 })
    generalGas!: number;

    @ApiProperty({ description: "合约交易Gas，默认为0", default: 0 })
    contractGas!: number;
}
