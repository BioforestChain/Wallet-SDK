import { ApiProperty } from "@nestjs/swagger";
import { ExternalChainName, InternalChainName } from "../../..";

export class BFChainTransInBlockDto implements BFMetaNodeSDK.Basic.TransactionInBlockJSON {
    @ApiProperty()
    index: number;
    @ApiProperty()
    tIndex: number;
    @ApiProperty()
    height: number;
    @ApiProperty()
    numberOfSenderTransactions: number;
    @ApiProperty()
    transactionAssetChanges: BFMetaNodeSDK.Basic.TransactionAssetChangeJSON[];
    @ApiProperty()
    assetPrealnum?: BFMetaNodeSDK.Basic.AssetPrealnumJSON;
    @ApiProperty()
    signature: string;
    @ApiProperty()
    signSignature?: string;
    @ApiProperty()
    transaction: BFMetaNodeSDK.Basic.TransactionJSON;
}

export class BcfBroadcastTransactionReqDto implements WalletTypings.Bcf.Api.BcfBroadcastTransactionReqDto {
    @ApiProperty()
    version: number;
    @ApiProperty()
    type: string;
    @ApiProperty()
    senderId: string;
    @ApiProperty()
    senderPublicKey: string;
    @ApiProperty()
    senderSecondPublicKey?: string;
    @ApiProperty()
    recipientId?: string;
    @ApiProperty()
    rangeType: 0 | 1 | 2 | 4;
    @ApiProperty()
    range: string[];
    @ApiProperty()
    fee: string;
    @ApiProperty()
    timestamp: number;
    @ApiProperty()
    dappid?: string;
    @ApiProperty()
    lns?: string;
    @ApiProperty()
    sourceIP?: string;
    @ApiProperty()
    fromMagic: string;
    @ApiProperty()
    toMagic: string;
    @ApiProperty()
    applyBlockHeight: number;
    @ApiProperty()
    effectiveBlockHeight: number;
    @ApiProperty()
    signature: string;
    @ApiProperty()
    signSignature?: string;
    @ApiProperty()
    remark: { [key: string]: string };
    @ApiProperty()
    asset: object;
    @ApiProperty()
    storage?: BFMetaNodeSDK.Basic.TransactionStorageJSON;
    @ApiProperty()
    storageKey?: string;
    @ApiProperty()
    storageValue?: string;
    @ApiProperty()
    nonce: number;
}

export class BcfBroadcastTransactionNotifyReqDto implements WalletTypings.Bcf.Api.BcfBroadcastTransactionNotifyReqDto {
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
        chain: InternalChainName; // 链名
        info: {
            assetType: string;
            trs: WalletTypings.Bcf.Api.BcfBroadcastTransactionReqDto; // 内链确保转账交易，assetType跟传进来的一样,接收地址跟发送地址跟传进来的相匹配
            trsId: string; //交易id，交易id判断该交易体没上链过（避免拿以前上链交易进来）
        };
    };
}
