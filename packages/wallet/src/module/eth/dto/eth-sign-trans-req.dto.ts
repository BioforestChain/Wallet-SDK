import { ApiProperty } from "@nestjs/swagger";

export class EthSignTransactionReqDto implements WalletTypings.Eth.Api.EthSignTransactionReqDto {
    @ApiProperty({ description: "交易信息" })
    trans!: BFChainWallet.ETH.TransactionBody;

    @ApiProperty({ description: "交易用户私钥" })
    privateKey!: string;
}
