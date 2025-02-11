import { ExternalChainName, ExternalTransStateID } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**更新外链交易状态 */
export class UpdateExternalTransStateReqDto implements WalletTypings.ExternalChain.Api.UpdateExternalTransStateReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId: string;

    @IsNotEmpty()
    @ApiProperty({ description: "交易状态", enum: ExternalTransStateID })
    state: ExternalTransStateID;
}
