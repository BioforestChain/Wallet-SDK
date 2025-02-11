import { AIRDROP_TYPE, InternalChainName } from "@bnqkl/wallet-sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Type, Transform } from "class-transformer";

export class AirdropReqDto implements WalletTypings.Airdrop.Api.AirdropReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "空投链名" })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "空投类型", enum: AIRDROP_TYPE })
    @Type(() => Number)
    airdropType: AIRDROP_TYPE;

    @IsNotEmpty()
    @ApiProperty({ description: "dp发行信息" })
    @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
    issueDpInfo: WalletTypings.Airdrop.IssueDpInfo;

    @IsNotEmpty()
    @ApiProperty({ description: "dp转移信息" })
    @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
    transferDpInfos: WalletTypings.Airdrop.TransferDpInfo[];

    @IsOptional()
    @ApiProperty({ description: "空投完成后通知的消息队列id", required: false })
    mqId?: string;

    @IsOptional()
    @ApiProperty({ description: "上传的文件", type: "string", format: "binary", required: false })
    file?: any;
}
