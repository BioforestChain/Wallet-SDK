import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DownloadFileReqDto implements WalletTypings.InternalChain.Api.DownloadFileReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "下载文件在链上的url" })
    blobUrl!: string;
}
