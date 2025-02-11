import { GetExternalTransReqDto } from "./get-external-trans-req.dto";

/**获取外链交易手续费信息 */
export class GetExternalTransFeeInfoReqDto extends GetExternalTransReqDto implements WalletTypings.ExternalChain.Api.GetExternalTransFeeInfoReqDto {}
