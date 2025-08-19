import { InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**生成内链交易逻辑对象 */
export class CreateInternalTransObjReqDto implements WalletTypings.InternalChain.Api.CreateInternalTransObjReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName!: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId!: string;
}
