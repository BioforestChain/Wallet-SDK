import { ApiProperty } from "@nestjs/swagger";

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
