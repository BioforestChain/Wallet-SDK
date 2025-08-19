import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class TronSendTrxDto implements WalletTypings.Tron.Api.TronCreateNormalTransV2ReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "交易发起地址" })
    from!: string;

    @IsNotEmpty()
    @ApiProperty({ description: "交易接收地址" })
    to!: string;

    @IsNumberString()
    @ApiProperty({ description: "交易金额" })
    amount!: string;
}

export class TronSendTrc20Dto implements WalletTypings.Tron.Api.TronCreateContractTransV2ReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "交易发起地址" })
    from!: string;

    @IsNotEmpty()
    @ApiProperty({ description: "交易接收地址" })
    to!: string;

    @IsNumberString()
    @ApiProperty({ description: "交易金额" })
    amount!: string;

    @IsNotEmpty()
    @ApiProperty({ description: "合约地址" })
    contractAddress!: string;
}
