import { RMB_TRANS_STATE_ID } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**更新外链交易状态 */
export class UpdateRmbTransStateReqDto implements WalletTypings.Rmb.Api.UpdateRmbTransStateReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "交易id" })
    txId: string;

    @IsNotEmpty()
    @ApiProperty({ description: "交易状态", enum: RMB_TRANS_STATE_ID })
    state: RMB_TRANS_STATE_ID;
}
