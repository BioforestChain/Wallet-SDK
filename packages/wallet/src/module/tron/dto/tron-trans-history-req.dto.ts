import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min } from "class-validator";

export class TronTransHistoryReqDto implements WalletTypings.Tron.Api.TronTransHistoryReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "查询地址(必须为 Base58check 格式)" })
    address!: string;

    @ApiProperty({ description: "指定合约地址(适用于合约交易查询)", required: false })
    contract_address?: string;

    @Min(1)
    @Max(200)
    @ApiProperty({
        description: "每页结果数，默认20，最大200",
        default: 20,
    })
    limit!: number;

    @ApiProperty({ description: "翻页参数，指定上一页的 fingerprint", required: false })
    fingerprint?: string;
}
