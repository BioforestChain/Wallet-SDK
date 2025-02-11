import { EthSignTransactionReqDto } from "../../eth/dto";

export class BscSignTransactionReqDto extends EthSignTransactionReqDto implements WalletTypings.Bsc.Api.BscSignTransactionReqDto {}
