import { InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**创建内链交易基础参数 */
export class CreateTrBaseParam implements WalletTypings.InternalChain.CreateTrBaseParam {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "发送者私钥" })
    secret: string;

    @IsOptional()
    @ApiProperty({ description: "业务参数", required: false })
    param?: WalletTypings.Entity.BusinessParam;

    @IsOptional()
    @ApiProperty({ description: "二次密码", required: false })
    secondSecretInfo?: TransactionMaker.Transaction.SecondSecretInfo;

    @IsOptional()
    @ApiProperty({ description: "事件备注信息", required: false })
    remark?: {
        [key: string]: string;
    };

    @IsOptional()
    @ApiProperty({ description: "手续费", required: false })
    fee?: string;
}

export class CreateTrBaseParamWithRecipientId extends CreateTrBaseParam implements WalletTypings.InternalChain.CreateTrBaseParamWithRecipientId {
    @IsNotEmpty()
    @ApiProperty({ description: "接收者地址" })
    recipientId: string;
}

/**生成权益转移交易 */
export class CreateInternalTransferAssetReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateInternalTransferAssetReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "资产类型" })
    assetType: string;

    @IsNotEmpty()
    @ApiProperty({ description: "转账数量" })
    amount: string;
}

/**生成发行权益交易 */
export class CreateInternalIssueAssetReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateInternalIssueAssetReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "发行的权益信息" })
    assetInfo: TransactionMaker.Transaction.IssueAssetTransactionParams["assetInfo"];
}

/**生成增发权益交易 */
export class CreateInternalIncreaseAssetReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateInternalIncreaseAssetReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "增发的权益信息" })
    assetInfo: TransactionMaker.Transaction.IncreaseAssetTransactionParams["assetInfo"];

    @IsOptional()
    @ApiProperty({ description: "冻结的主权益数量，0-9 组成并且不包含小数点", required: false })
    frozenMainAssetPrealnum?: string;
}

/**生成销毁权益交易 */
export class CreateInternalDestroyAssetReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateInternalDestroyAssetReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "销毁的权益信息" })
    assetInfo: TransactionMaker.Transaction.DestroyAssetTransactionParams["assetInfo"];
}

/**生成质押权益交易 */
export class CreateInternalStakeAssetReqDto extends CreateTrBaseParam implements WalletTypings.InternalChain.Api.CreateInternalStakeAssetReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "质押的权益信息" })
    assetInfo: TransactionMaker.Transaction.StakeAssetTransactionParams["assetInfo"];

    @IsNotEmpty()
    @ApiProperty({ description: "质押的唯一索引：1-30 个字符，小写字母 + 数字" })
    stakeId: string;

    @IsNotEmpty()
    @ApiProperty({ description: "质押的权益开始接质押的区块间隔，0-9 组成并且不包含小数点" })
    numberOfUnstakeHeight: number;
}

/**生成解除质押权益交易 */
export class CreateInternalUnstakeAssetReqDto extends CreateTrBaseParam implements WalletTypings.InternalChain.Api.CreateInternalUnstakeAssetReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "质押的权益信息" })
    assetInfo: TransactionMaker.Transaction.UnstakeAssetTransactionParams["assetInfo"];

    @IsNotEmpty()
    @ApiProperty({ description: "质押的唯一索引：1-30 个字符，小写字母 + 数字" })
    stakeId: string;
}
