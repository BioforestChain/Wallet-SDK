import { ExternalChainName } from "@bnqkl/wallet-typings";
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

    @ApiProperty({ description: "通知url", required: false })
    notify?: string;
}

export class TRC20TransactionNotifyDto {
    @ApiProperty()
    notifyUrl: string; // url
    @ApiProperty()
    toAddress: string; // 接收地址
    @ApiProperty()
    fromAddress: string; // 发送地址
    @ApiProperty()
    amount: string; // 发送数量
    @ApiProperty()
    timestamp: number; // 时间戳，用于签名用
    @ApiProperty()
    signature: string; /// 内链对整个 json签名
    @ApiProperty()
    publickey: string; /// 签名对应公钥
    trsInfo: {
        chain: ExternalChainName; // 链名
        info: {
            contractAddress: string; // 外链的话有合约地址，解析合约地址
            trs: {
                visible: boolean;
                signature?: string[];
                txID: string;
                raw_data: BFChainWallet.TRON.Trc20TransactionRawData;
                raw_data_hex: string;
                ret?: { contractRet: string }[];
                detail: WalletTypings.ExternalChain.ExternalTransDetail;
            };
            trsId: string; //交易id，交易id判断该交易体没上链过（避免拿以前上链交易进来）
        };
    };
}
