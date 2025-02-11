import { ExternalChainName, InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class ExternalAssetQueryParam implements WalletCore.ChainData.ExternalAssetQueryParam {
    @IsNotEmpty()
    @ApiProperty({ description: "链名" })
    chainName: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "地址" })
    address: string;

    @IsOptional()
    @ApiProperty({ description: "合约地址" })
    contractAddress?: string;
}

export class InternalAssetQueryParam implements WalletCore.ChainData.InternalAssetQueryParam {
    @IsNotEmpty()
    @ApiProperty({ description: "链名" })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "地址" })
    address: string;

    @IsNotEmpty()
    @ApiProperty({ description: "资产类型" })
    assetType: string;
}

export class MultiGetAssetInfoReqDto implements WalletCore.ChainData.Api.MultiGetAssetInfoReqDto {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ description: "资产查询参数", type: [ExternalAssetQueryParam, InternalAssetQueryParam] })
    queryParams: (ExternalAssetQueryParam | InternalAssetQueryParam)[];
}
