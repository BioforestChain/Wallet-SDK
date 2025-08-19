import { EthSignTransactionReqDto } from "../../eth/dto/index.js";

export class BscSignTransactionReqDto extends EthSignTransactionReqDto implements WalletTypings.Bsc.Api.BscSignTransactionReqDto {}
