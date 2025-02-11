import { EthGetBlockReqDto } from "../../eth/dto";

/**获取区块 */
export class BscGetBlockReqDto extends EthGetBlockReqDto implements WalletTypings.Bsc.Api.BscGetBlockReqDto {}
