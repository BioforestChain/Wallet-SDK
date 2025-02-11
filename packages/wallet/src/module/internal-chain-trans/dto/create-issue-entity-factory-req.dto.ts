import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { CreateTrBaseParamWithRecipientId } from "./create-internal-asset-req.dto";

/**生成发行非同质资产模板交易 */
export class CreateIssueEntityFactoryReqDto extends CreateTrBaseParamWithRecipientId implements WalletTypings.InternalChain.Api.CreateIssueEntityFactoryReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "发行的非同质资产模板信息" })
    issueFactoryInfo: TransactionMaker.Transaction.IssueEntityFactoryTransactionParams["factoryInfo"];
}
