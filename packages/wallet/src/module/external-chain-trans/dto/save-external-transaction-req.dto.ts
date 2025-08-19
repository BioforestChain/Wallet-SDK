import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**保存外链交易 */
export class SaveExternalTransactionReqDto implements WalletTypings.ExternalChain.Api.SaveExternalTransactionReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName!: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "交易体" })
    transactionJSON!: WalletTypings.ExternalChain.EthTrJson | BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction;

    @IsNotEmpty()
    @ApiProperty({ description: "外链交易详情" })
    detail!: WalletTypings.ExternalChain.ExternalTransDetail;

    @IsOptional()
    @ApiProperty({ description: "业务参数" })
    param?: WalletTypings.Entity.BusinessParam;
}
