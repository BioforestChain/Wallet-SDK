import { EthSignTransactionReqDto } from "../../eth/dto.js";

export class BscSignTransactionReqDto extends EthSignTransactionReqDto implements WalletTypings.Bsc.Api.BscSignTransactionReqDto {}
