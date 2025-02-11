import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UploadFileReqDto implements WalletTypings.InternalChain.Api.UploadFileReqDto {
    @ApiProperty({ description: "上传的文件", type: "string", format: "binary" })
    file: any;
}

export class UploadFilesReqDto implements WalletTypings.InternalChain.Api.UploadFilesReqDto {
    @ApiProperty({ description: "上传的文件数组", type: "string", format: "binary", isArray: true })
    files: any[];
}
