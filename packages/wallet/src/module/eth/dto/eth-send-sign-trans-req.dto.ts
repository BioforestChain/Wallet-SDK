import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EthSendSignTransReqDto implements WalletTypings.Eth.Api.EthSendSignTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "已签名的交易字符串" })
    signTransData: string;

    @ApiProperty({ description: "交易详情", required: false })
    detail: WalletTypings.ExternalChain.ExternalTransDetail;
}

export class EthBrocastDirectReqDto implements WalletTypings.Eth.Api.EthBrocastDirectReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "已签名的交易字符串" })
    signTransData: string;
}
export class EthBrocastDirectNotifyReqDto {
    @ApiProperty()
    customParamString?: string; // 自定义参数
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
            trs: string; // 外链合约交易体，解析里面的数据，需要跟外部的 接收地址,数量,跟合约地址匹配, 并且是转账交易
            trsId: string; //交易id，交易id判断该交易体没上链过（避免拿以前上链交易进来）
        };
    };
}
