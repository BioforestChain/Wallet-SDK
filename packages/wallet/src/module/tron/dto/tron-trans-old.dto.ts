import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TronTransactionDto implements WalletTypings.Tron.Api.TronBroadcastNormalTransReqDto {
    @ApiProperty({
        description: "账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址",
        required: false,
    })
    visible: boolean;

    @ApiProperty({ type: [String], description: "交易签名，签名后获得" })
    signature?: string[];

    @ApiProperty({ description: "交易ID" })
    txID: string;

    @ApiProperty({ description: "交易json" })
    raw_data: BFChainWallet.TRON.TronTransactionRawData;

    @ApiProperty({ description: "交易 raw_data 通过 protobuf 序列化后的二进制，Hex格式" })
    raw_data_hex: string;

    @ApiProperty({ description: "交易详情" })
    detail: WalletTypings.ExternalChain.ExternalTransDetail;

    @ApiPropertyOptional()
    ret?: { contractRet: string }[];
}

export class TRC20TransactionDto implements WalletTypings.Tron.Api.TronBroadcastContractTransReqDto {
    @ApiProperty({
        description: "账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址",
        required: false,
    })
    visible: boolean;

    @IsNotEmpty()
    @ApiProperty({ type: [String], description: "交易签名，签名后获得" })
    signature?: string[];

    @IsNotEmpty()
    @ApiProperty({ description: "交易ID" })
    txID: string;

    @IsNotEmpty()
    @ApiProperty({ description: "TRC20交易json" })
    raw_data: BFChainWallet.TRON.Trc20TransactionRawData;

    @ApiProperty({ description: "交易 raw_data 通过 protobuf 序列化后的二进制，Hex格式" })
    raw_data_hex: string;

    @ApiProperty({ required: false })
    ret?: { contractRet: string }[];

    @ApiProperty({ description: "交易详情" })
    detail: WalletTypings.ExternalChain.ExternalTransDetail;
}
