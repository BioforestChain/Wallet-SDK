import { ApiProperty } from "@nestjs/swagger";

/**eth-普通交易测试(仅测试环境使用) */
export class EthCreateTransReqDto implements WalletTypings.Eth.Api.EthCreateTransReqDto {
    @ApiProperty({ description: "交易发起地址" })
    from!: string;

    @ApiProperty({ description: "交易接收地址" })
    to!: string;

    @ApiProperty({ description: "交易金额" })
    amount!: string;

    @ApiProperty({ description: "资产标识" })
    assetSymbol!: string;

    @ApiProperty({ description: "合约地址" })
    contract!: string;

    @ApiProperty({ description: "私钥" })
    privateKey!: string;
}
