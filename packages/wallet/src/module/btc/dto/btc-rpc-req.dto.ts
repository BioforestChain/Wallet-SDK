import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export class BTCRPCReqDto {
    @ApiProperty({ description: "rpc版本" })
    jsonrpc!: string;

    @ApiProperty({ description: "rpc方法" })
    method!: string;

    @ApiProperty({ description: "参数" })
    params!: any[];
}

export class BTCBlockBookReqDto {
    @ApiProperty({ description: "url , 如 /api/v2/address/xxxxx " })
    url!: string;

    @IsIn(["GET", "POST"])
    @ApiProperty({ description: "GET 或者 POST" })
    method!: string;

    @ApiProperty({ description: "参数" })
    body!: any;
}
