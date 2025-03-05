import { NotifyResult } from "@bnqkl/wallet-core";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class GetNotifyListDto {
    @IsOptional()
    @ApiProperty({ description: "交易签名", required: false })
    trSignature?: string;
    @IsOptional()
    @ApiProperty({ description: "fromAddress", required: false })
    fromAddress?: string;
    @IsOptional()
    @ApiProperty({ description: "tid", required: false })
    tid?: string;
    @IsOptional()
    @ApiProperty({ description: "notifyResult", required: false })
    notifyResult?: NotifyResult;
}

export class UpdateNotifyDto {
    @ApiProperty({ description: "id" })
    id: number;
    @ApiProperty({ description: "notifyResult" })
    notifyResult: NotifyResult;
    @ApiProperty({ description: "verifyKey" })
    verifyKey: string;
}
