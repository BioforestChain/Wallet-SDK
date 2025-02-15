import { ApiProperty } from "@nestjs/swagger";
import { EthBrocastDirectNotifyReqDto, EthBrocastDirectReqDto, EthSendSignTransReqDto } from "../../eth/dto";

export class BscSendSignTransReqDto extends EthSendSignTransReqDto implements WalletTypings.Bsc.Api.BscSendSignTransReqDto {}

export class BscBrocastDirectReqDto extends EthBrocastDirectReqDto implements WalletTypings.Bsc.Api.BscBrocastDirectReqDto {}

export class BscBrocastDirectNotifyReqDto extends EthBrocastDirectNotifyReqDto {}
