import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

export class BcfGetPendingTrReqDto implements WalletTypings.Bcf.Api.BcfGetPendingTrReqDto {
    @ApiProperty({ description: "发起者地址" })
    senderId?: string;

    @IsOptional()
    @IsIn([1, -1])
    @ApiProperty({ description: "1为正序 -1 为逆序" })
    sort?: 1 | -1;
}
