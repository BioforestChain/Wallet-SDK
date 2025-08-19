import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { CreateTrBaseParamWithRecipientId } from "./create-internal-asset-req.dto.js";

/**生成发行非同质资产交易 */
export class CreateIssueEntityReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateIssueEntityReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "发行的非同质资产信息" })
    issueEntityInfo!: TransactionMaker.Transaction.IssueEntityTransactionParams["entityInfo"];
}

/**生成批量发行非同质资产交易 */
export class CreateIssueEntityMultiReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateIssueEntityMultiReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "发行的非同质资产信息" })
    issueEntityInfo!: TransactionMaker.Transaction.IssueEntityMultiTransactionParams["entityInfo"];
}
