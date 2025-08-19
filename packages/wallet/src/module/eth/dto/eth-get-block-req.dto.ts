import { ApiProperty } from "@nestjs/swagger";

/**获取区块 */
export class EthGetBlockReqDto implements WalletTypings.Eth.Api.EthGetBlockReqDto {
    @ApiProperty({ description: "区块id" })
    blockNumber!: number;
}
