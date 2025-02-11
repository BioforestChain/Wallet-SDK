import { ApiProperty } from "@nestjs/swagger";

/**eth-获取合约交易的data */
export class Erc20TransDataReqDto implements WalletTypings.Eth.Api.Erc20TransDataReqDto {
    @ApiProperty({ description: "交易发起地址" })
    from: string;

    @ApiProperty({ description: "交易接收地址" })
    to: string;

    @ApiProperty({ description: "交易金额" })
    amount: string;

    @ApiProperty({ description: "合约地址" })
    contractAddress: string;
}
