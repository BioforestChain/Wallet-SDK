import { CommonHelper } from "@bnqkl/wallet-sdk";
import { ALIPAY_TRADE_STATUS } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

/**支付宝订单异步回调通知 */
export class NotifyAlipayReqDto implements WalletTypings.Rmb.Api.NotifyAlipayReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "外部交易id" })
    out_trade_no: string;

    @IsNotEmpty()
    @ApiProperty({ description: "支付宝交易id", default: CommonHelper.getUuid() })
    trade_no: string;

    @IsNotEmpty()
    @ApiProperty({ description: "交易状态", enum: ALIPAY_TRADE_STATUS, default: ALIPAY_TRADE_STATUS.TRADE_SUCCESS })
    trade_status: ALIPAY_TRADE_STATUS;
}
