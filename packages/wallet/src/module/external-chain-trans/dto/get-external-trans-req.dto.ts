import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取外链交易 */
export class GetExternalTransReqDto implements WalletTypings.ExternalChain.Api.GetExternalTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName!: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId!: string;
}
