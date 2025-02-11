import { ApiProperty } from "@nestjs/swagger";

export class TronBlockResDto implements WalletTypings.Tron.TronBlockData {
    @ApiProperty({ description: "区块ID" })
    blockID: string;

    @ApiProperty({ description: "区块高度" })
    number: number;
}
