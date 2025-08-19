import { ApiProperty } from "@nestjs/swagger";

export class BFChainBlockDto implements BFMetaNodeSDK.Basic.BlockWithoutTransactionJSON {
    @ApiProperty()
    version!: number;
    @ApiProperty()
    height!: number;
    @ApiProperty()
    blockSize!: number;
    @ApiProperty()
    timestamp!: number;
    @ApiProperty()
    signature!: string;
    @ApiProperty()
    signSignature?: string;
    @ApiProperty()
    generatorPublicKey!: string;
    @ApiProperty()
    generatorSecondPublicKey?: string;
    @ApiProperty()
    generatorEquity!: string;
    @ApiProperty()
    numberOfTransactions!: number;
    @ApiProperty()
    payloadHash!: string;
    @ApiProperty()
    payloadLength!: number;
    @ApiProperty()
    previousBlockSignature!: string;
    @ApiProperty()
    totalAmount!: string;
    @ApiProperty()
    totalFee!: string;
    @ApiProperty()
    reward!: string;
    @ApiProperty()
    magic!: string;
    @ApiProperty()
    blockParticipation!: string;
    @ApiProperty()
    remark!: { [key: string]: string };
    @ApiProperty()
    asset!: object;
    @ApiProperty()
    statisticInfo!: BFMetaNodeSDK.Basic.StatisticInfoJSON;
    @ApiProperty()
    roundOfflineGeneratersHashMap!: BFMetaNodeSDK.Basic.RoundOfflineGeneratersHashMap;
}
