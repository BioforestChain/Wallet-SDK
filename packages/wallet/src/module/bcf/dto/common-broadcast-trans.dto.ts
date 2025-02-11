import { ApiProperty } from "@nestjs/swagger";

export class BcfCommonBroadcastTransDto implements BFMetaNodeSDK.Transaction.BroadcastTransacationParams {
    @ApiProperty({ description: "交易buffer" })
    buffer: string;
    @ApiProperty({ description: "交易签名" })
    signature: string;
    @ApiProperty({ description: "交易安全签名", required: false })
    signSignature?: string;
}
