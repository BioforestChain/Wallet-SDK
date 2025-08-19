import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TronBaseReqDto implements WalletTypings.Tron.Api.TronBaseReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "用户地址" })
    address!: string;
}
