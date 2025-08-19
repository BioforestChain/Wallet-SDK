import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TronTransBodyDto implements BFChainWallet.TRON.TronTransaction {
    @ApiProperty({ description: "默认false" })
    visible!: boolean;
    @ApiProperty({ description: "交易ID" })
    txID!: string;
    @ApiProperty({ description: "交易json" })
    raw_data!: BFChainWallet.TRON.TronTransactionRawData;
    @ApiProperty({ description: "交易json hex格式" })
    raw_data_hex!: string;
    @ApiProperty({ description: "交易签名(签名后获得)" })
    signature?: string[];
    @ApiPropertyOptional()
    ret?: { contractRet: string }[];
}

export class Trc20TransBodyDto implements BFChainWallet.TRON.Trc20Transaction {
    @ApiProperty({ description: "默认false" })
    visible!: boolean;
    @ApiProperty({ description: "交易ID" })
    txID!: string;
    @ApiProperty({ description: "交易json" })
    raw_data!: BFChainWallet.TRON.Trc20TransactionRawData;
    @ApiProperty({ description: "交易json hex格式" })
    raw_data_hex!: string;
    @ApiProperty({ description: "交易签名(签名后获得)" })
    signature?: string[];
    @ApiPropertyOptional()
    ret?: { contractRet: string }[];
}
