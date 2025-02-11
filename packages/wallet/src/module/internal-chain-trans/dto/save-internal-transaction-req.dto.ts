import { InternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**保存内链交易 */
export class SaveInternalTransactionReqDto implements WalletTypings.InternalChain.Api.SaveInternalTransactionReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: InternalChainName })
    chainName: InternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易体" })
    transactionJSON: BFMetaNodeSDK.Basic.TransactionJSON;

    @IsOptional()
    @ApiProperty({ description: "业务参数" })
    param?: WalletTypings.Entity.BusinessParam;
}
