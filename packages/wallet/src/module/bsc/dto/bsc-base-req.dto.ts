import { EthBaseReqDto, EthQueryTransReqDto } from "../../eth/dto";

export class BscBaseReqDto extends EthBaseReqDto implements WalletTypings.Bsc.Api.BscBaseReqDto {}

export class BscQueryTransReqDto extends EthQueryTransReqDto implements WalletTypings.Bsc.Api.BscQueryTransReqDto {}
