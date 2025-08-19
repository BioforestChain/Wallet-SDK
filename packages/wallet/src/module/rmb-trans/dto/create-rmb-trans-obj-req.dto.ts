import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**生成人民币交易逻辑对象 */
export class CreateRmbTransObjReqDto implements WalletTypings.Rmb.Api.CreateRmbTransObjReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId!: string;
}
