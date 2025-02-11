import { InternalChainName, InternalTransStateID } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**更新内链交易状态 */
export class UpdateInternalTransStateReqDto implements WalletTypings.InternalChain.Api.UpdateInternalTransStateReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId: string;

    @IsNotEmpty()
    @ApiProperty({ description: "交易状态", enum: InternalTransStateID })
    state: InternalTransStateID;
}
