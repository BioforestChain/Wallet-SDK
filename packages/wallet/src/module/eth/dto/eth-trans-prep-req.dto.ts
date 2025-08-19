import { ExternalTransType } from "@bnqkl/wallet-sdk";
import { ApiProperty } from "@nestjs/swagger";

/**eth-交易前需要的预备信息 */
export class EthTransPrepReqDto implements WalletTypings.Eth.Api.EthTransPrepReqDto {
    @ApiProperty({ description: "交易发起地址" })
    from!: string;

    @ApiProperty({ description: "交易接收地址" })
    to!: string;

    @ApiProperty({ description: "交易金额" })
    amount!: string;

    @ApiProperty({ description: "交易类型", enum: ExternalTransType })
    type!: ExternalTransType;

    @ApiProperty({ description: "合约地址" })
    contractAddress?: string;
}
