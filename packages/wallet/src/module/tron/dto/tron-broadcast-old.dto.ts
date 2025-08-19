import { ApiProperty } from "@nestjs/swagger";

export class TronBroadcastTransDto implements BFChainWallet.TRON.BroadcastTransactionRes {
    @ApiProperty({ description: "交易是否成功: true: 成功，false: 失败" })
    result!: boolean;

    @ApiProperty({ description: "交易ID" })
    txid!: string;

    @ApiProperty({ description: "交易失败时出现，显示为交易失败原因的code" })
    code?: string;

    @ApiProperty({ description: "信息" })
    message!: string;
}
