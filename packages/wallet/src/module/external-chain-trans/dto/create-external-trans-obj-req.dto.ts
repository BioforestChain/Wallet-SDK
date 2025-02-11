import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**生成外链交易逻辑对象 */
export class CreateExternalTransObjReqDto implements WalletTypings.ExternalChain.Api.CreateExternalTransObjReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId: string;
}
