import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min } from "class-validator";
import { API_SCAN_SORT_ENUM } from "../../../common/constants.js";

export class EthTransHistoryReqDto implements WalletTypings.Eth.Api.EthTransHistoryReqDto {
    @IsNotEmpty({ message: "参数错误" })
    @ApiProperty({ description: "用户地址" })
    address: string;

    @ApiProperty({ description: "合约地址，仅适用于查询erc20交易", required: false })
    contractaddress?: string;

    @ApiProperty({ description: "查询开始区块，默认为 0", default: 0, required: false })
    startblock?: number;

    @ApiProperty({
        description: "查询结束区块，默认为 999999999",
        default: 999999999,
        required: false,
    })
    endblock?: number;

    @Min(1)
    @ApiProperty({ description: "页码, 默认为 1", default: 1, required: false })
    page?: number;

    @Min(1)
    @Max(200)
    @ApiProperty({
        description: "每页显示交易数量，默认为20，不可超过200",
        default: 20,
        required: false,
    })
    offset?: number;

    @ApiProperty({
        description: "排序偏好：默认为 desc 降序",
        enum: API_SCAN_SORT_ENUM,
        default: API_SCAN_SORT_ENUM.DESC,
        required: false,
    })
    sort?: string;
}
