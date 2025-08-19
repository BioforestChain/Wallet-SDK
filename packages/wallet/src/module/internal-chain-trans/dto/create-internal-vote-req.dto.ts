import { InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**生成内链转账交易 */
export class CreateVoteTrReqDto implements WalletTypings.InternalChain.Api.CreateVoteTrReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName!: InternalChainName;

    @ApiProperty({ description: "交易参数" })
    data!: TransactionMaker.Transaction.VoteTransactionParams;
}
