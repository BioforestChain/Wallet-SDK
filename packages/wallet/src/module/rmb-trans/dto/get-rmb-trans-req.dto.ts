import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取人民币交易 */
export class GetRmbTransReqDto implements WalletTypings.Rmb.Api.GetRmbTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId: string;
}
