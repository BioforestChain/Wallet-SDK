import { ApiProperty } from "@nestjs/swagger";

export class BcfQueryTransactionReqDto implements WalletTypings.Bcf.Api.BcfQueryTransactionReqDto {
    @ApiProperty()
    signature?: string;
    @ApiProperty()
    height?: number;
    @ApiProperty()
    minHeight?: number;
    @ApiProperty()
    maxHeight?: number;
    @ApiProperty()
    senderId?: string;
    @ApiProperty()
    recipientId?: string;
    @ApiProperty({ type: [String] })
    type?: string[];
    @ApiProperty({ minimum: 1 })
    page?: number;
    @ApiProperty({ minimum: 1 })
    pageSize?: number;
    @ApiProperty({ description: "1为正序 -1 为逆序" })
    sort?: number;
}
