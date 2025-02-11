import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive } from "class-validator";

export class TronCreateTransDto implements WalletTypings.Tron.Api.TronCreateNormalTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "转账转出地址，Base58check格式 或 Hex格式" })
    owner_address: string;

    @IsNotEmpty()
    @ApiProperty({ description: "转账转入地址，Base58check格式 或 Hex格式" })
    to_address: string;

    @IsPositive()
    @ApiProperty({ description: "转账金额" })
    amount: number;

    @ApiProperty({
        description: "账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址",
        default: false,
        required: false,
    })
    visible?: boolean;

    @ApiProperty({ description: "交易时添加的备注信息", required: false })
    extra_data?: string;
}
