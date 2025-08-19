import { EthGetBlockReqDto } from "../../eth/dto.js";

/**获取区块 */
export class BscGetBlockReqDto extends EthGetBlockReqDto implements WalletTypings.Bsc.Api.BscGetBlockReqDto {}
