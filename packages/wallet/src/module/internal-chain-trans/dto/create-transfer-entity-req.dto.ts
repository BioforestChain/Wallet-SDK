import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { CreateTrBaseParamWithRecipientId } from "./create-internal-asset-req.dto.js";

/**生成转移资产交易 */
export class CreateTransferEntityReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateTransferEntityReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "转移资产id" })
    entityId: string;

    @IsOptional()
    @ApiProperty({ description: "纳税信息", required: false })
    taxInformation?: TransactionMaker.Transaction.TaxInformationJson;
}
