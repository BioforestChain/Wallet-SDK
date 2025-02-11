import { ApiProperty } from "@nestjs/swagger";

export class MinperByteResDto implements WalletTypings.Bcf.Api.BcfGetMinPerByteResDto {
    @ApiProperty()
    minFeePerByte: BFMetaNodeSDK.Common.FractionJSON<number>;
}
