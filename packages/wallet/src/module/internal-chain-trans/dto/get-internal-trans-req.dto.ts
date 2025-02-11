import { InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取内链交易 */
export class GetInternalTransReqDto implements WalletTypings.InternalChain.Api.GetInternalTransReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId: string;
}
