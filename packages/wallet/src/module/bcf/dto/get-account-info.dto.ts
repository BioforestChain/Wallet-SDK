import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BcfGetAddressInfoReqDto implements WalletTypings.Bcf.Api.BcfGetAddressInfoReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "地址" })
    address: string;
}

export class GetAccountInfoResDto implements WalletTypings.Bcf.Api.BcfGetAddressInfoResDto {
    @ApiProperty({ description: "地址" })
    address: string;
    @ApiProperty({ description: "公钥" })
    publicKey: string;
    @ApiProperty({ description: "二次公钥" })
    secondPublicKey: string;
    @ApiProperty({ description: "是否为受托人" })
    isDelegate: boolean;
    @ApiProperty({ description: "是否接受投票" })
    isAcceptVote: boolean;
    @ApiProperty({ description: "账户状态 0 正常, 1 冻结" })
    accountStatus: number;
    @ApiProperty({ description: "equityInfo" })
    equityInfo: {
        round: number;
        equity: string;
        fixedEquity: string;
    };
}
