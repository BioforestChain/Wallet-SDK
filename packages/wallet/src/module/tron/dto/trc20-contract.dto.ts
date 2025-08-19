import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class Trc20ContractReqDto implements WalletTypings.Tron.Api.Trc20ContractReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "用户地址，base58 或 hex 都可以" })
    address!: string;

    @IsNotEmpty()
    @ApiProperty({ description: "合约地址" })
    contract!: string;
}

export class Trc20ContractResDto implements WalletTypings.Tron.Api.Trc20ContractResDto {
    @ApiProperty({ description: "合约余额" })
    balance!: string;

    @ApiProperty({ description: "合约精度" })
    decimal!: number;
}
