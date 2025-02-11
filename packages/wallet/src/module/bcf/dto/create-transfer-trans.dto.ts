import { ApiProperty } from "@nestjs/swagger";

export class BcfCreateTransferAssetReqDto implements WalletTypings.Bcf.Api.BcfCreateTransferAssetReqDto {
    @ApiProperty({ description: "转账金额" })
    amount: string;
    @ApiProperty({ description: "发起者公钥" })
    publicKey: string;
    @ApiProperty({ description: "手续费" })
    fee: string;
    @ApiProperty({ description: "接收者" })
    recipientId: string;
    @ApiProperty({ description: "事件发起高度" })
    applyBlockHeight: number;
    @ApiProperty({ description: "事件有效高度", required: false })
    numberOfEffectiveBlocks?: number;
    @ApiProperty({ description: "来源链magic", required: false })
    sourceChainMagic?: string;
    @ApiProperty({ description: "来源链名", required: false })
    sourceChainName?: string;
    @ApiProperty({ description: "转账资产", required: false })
    assetType?: string;
    @ApiProperty({ description: "发起者安全密钥的公钥", required: false })
    secondPublicKey?: string;
    @ApiProperty({
        description:
            "事件的接收范围类型，只能是 0，1，2，4 中的某一个，0 表示不限定操作范围，1 表示只有指定的账户地址才能对这笔事件进行操作，2 表示只有指定的 dappid 才能对这笔事件进行操作，4 表示只有指定的位名才能对这笔事件进行操作，默认为 0",
        required: false,
    })
    rangeType?: number;
    @ApiProperty({
        description:
            "事件的接收范围，当 rangeType 为 0 时，不能填写任何数据，当 rangeType 为 1 时，只能填写账户地址，当 rangeType 为 2 时，只能填写 dappid，当 rangeType 为 4 时，只能填写位名，默认为空",
        required: false,
    })
    range?: string[];
    @ApiProperty({ description: "事件备注信息，默认为空", required: false })
    remark?: { [key: string]: string };
    @ApiProperty({
        description: "事件所属的 dappid，大写字母或数字，8 个字符，默认为空",
        required: false,
    })
    dappid?: string;
    @ApiProperty({
        description:
            "事件所属的位名，2-1024 个字符，每级位名最大长度为 128 个字符，一级位名只能时小写字母组成，二级及以上开头及结尾只能由小写字母或数字组成，中间可以包含下划线，根位名必须时本链链名，可选，默认为空",
        required: false,
    })
    lns?: string;
    @ApiProperty({
        description: "事件的来源IP，IPv4或者IPv6，不包含头尾(例如: 127.0.0.1)，默认为空",
        required: false,
    })
    sourceIP?: string;
    @ApiProperty({
        description: "事件的来源链网络标识符，大写字母或数字组成，5 个字符，默认使用创世块的 magic",
        required: false,
    })
    fromMagic?: string;
    @ApiProperty({
        description: "事件的去往链网络标识符，大写字母或数字组成，5 个字符，默认使用创世块的 magic",
        required: false,
    })
    toMagic?: string;
    @ApiProperty({ description: "事件的附加二进制数据", required: false })
    binaryInfos?: BFMetaNodeSDK.Transaction.KVStorageInfo[];
}
