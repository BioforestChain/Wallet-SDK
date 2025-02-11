import { ApiProperty } from "@nestjs/swagger";

export class BcfCommonPackageTransDto implements BFMetaNodeSDK.Transaction.PackageTransacationParams {
    @ApiProperty({ description: "交易签名" })
    signature: string;
    @ApiProperty({ description: "交易buffer" })
    buffer: string;
}
