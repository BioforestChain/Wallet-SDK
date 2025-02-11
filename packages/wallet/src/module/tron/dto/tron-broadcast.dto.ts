import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TronBroadcastTrxReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "trx交易体(已签名)" })
    transBody: BFChainWallet.TRON.TronTransaction;
    @ApiProperty({ description: "预估手续费" })
    estimateFee: string;
}

export class TronBroadcastTrc20ReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "trc20合约交易体(已签名)" })
    transBody: BFChainWallet.TRON.Trc20Transaction;
    @ApiProperty({ description: "预估手续费" })
    estimateFee: string;
}

export class TronBroadcastResDto implements BFChainWallet.TRON.BroadcastRes {
    @ApiProperty({ description: "广播结果" })
    result: boolean;
    @ApiProperty({ description: "交易ID" })
    txid: string;
    @ApiProperty({ description: "返回消息" })
    message: string;
}
