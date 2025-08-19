import { ApiProperty } from "@nestjs/swagger";

export class BcfCommonResponseTransDto {
    @ApiProperty({ description: "交易buffer" })
    buffer!: string;
}
