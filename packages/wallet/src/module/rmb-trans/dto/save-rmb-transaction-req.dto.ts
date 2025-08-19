import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**保存人民币交易 */
export class SaveRmbTransactionReqDto implements WalletTypings.Rmb.Api.SaveRmbTransactionReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "人民币交易详情" })
    detail!: WalletTypings.Rmb.RmbTransDetail;

    @IsOptional()
    @ApiProperty({ description: "业务参数" })
    param?: WalletTypings.Entity.BusinessParam;
}
