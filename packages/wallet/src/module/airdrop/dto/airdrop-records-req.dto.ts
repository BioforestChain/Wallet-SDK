import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { AIRDROP_TYPE, InternalChainName } from "@bnqkl/wallet-sdk";
import { PageReqDto } from "../../../common.js";

export class AirdropRecordsReqDto extends PageReqDto implements WalletTypings.Airdrop.Api.AirdropRecordsReqDto {
    @IsOptional()
    @ApiProperty({ description: "空投链名", required: false })
    chainName?: InternalChainName;

    @IsOptional()
    @ApiProperty({ description: "空投地址", required: false })
    address?: string;

    @IsOptional()
    @ApiProperty({ description: "空投类型", enum: AIRDROP_TYPE, required: false })
    @Type(() => Number)
    airdropType?: AIRDROP_TYPE;
}
