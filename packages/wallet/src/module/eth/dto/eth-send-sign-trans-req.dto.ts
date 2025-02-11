import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EthSendSignTransReqDto implements WalletTypings.Eth.Api.EthSendSignTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "已签名的交易字符串" })
    signTransData: string;

    @ApiProperty({ description: "交易详情", required: false })
    detail: WalletTypings.ExternalChain.ExternalTransDetail;
}

export class EthBrocastDirectReqDto implements WalletTypings.Eth.Api.EthBrocastDirectReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "已签名的交易字符串" })
    signTransData: string;
}
