import { ApiProperty } from "@nestjs/swagger";

export class BcfQueryBlockReqDto implements WalletTypings.Bcf.Api.BcfQueryBlockReqDto {
    @ApiProperty()
    signature?: string;
    @ApiProperty()
    height?: number;
    @ApiProperty({ minimum: 1 })
    page?: number;
}
