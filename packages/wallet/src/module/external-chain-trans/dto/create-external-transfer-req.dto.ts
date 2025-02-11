import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**生成外链转账交易 */
export class CreateExternalTransferReqDto implements WalletTypings.ExternalChain.Api.CreateExternalTransferReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName: ExternalChainName;

    @IsNotEmpty()
    @ApiProperty({ description: "发送者账户" })
    account: WalletTypings.ExternalChain.WalletAccount;

    @IsNotEmpty()
    @ApiProperty({ description: "接收者地址" })
    recipientId: string;

    @ApiProperty({ description: "合约地址" })
    contractAddress?: string;

    @IsNotEmpty()
    @ApiProperty({ description: "转账数量" })
    amount: string;

    @IsOptional()
    @ApiProperty({ description: "业务参数" })
    param?: WalletTypings.Entity.BusinessParam;
}
