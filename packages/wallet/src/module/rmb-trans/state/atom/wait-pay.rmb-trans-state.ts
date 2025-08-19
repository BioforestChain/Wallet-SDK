import { RMB_TRANS_STATE_ID } from "@bnqkl/wallet-sdk";
import { Injectable } from "@nestjs/common";
import { Logger } from "@bnqkl/wallet-sdk";
import type { RmbTransObj } from "../../rmb-trans-obj.js";
import { RmbTransState } from "../rmb-trans.state.js";

/**等待支付状态 */
@Injectable()
export class WaitPay_RmbTransState extends RmbTransState {
    constructor() {
        super(RMB_TRANS_STATE_ID.WAIT_PAY);
    }

    /**
     * 进入状态前置逻辑
     * @param transObj
     */
    async beforeEnterState(transObj: RmbTransObj): Promise<void> {
        // 保存state
        await transObj.saveState();
    }

    /**
     * 进入状态
     * @param transObj
     */
    async onEnterState(transObj: RmbTransObj): Promise<void> {
        Logger.info(`[${transObj.platformName}] txId:${transObj.txId} 等待用户付款`);
        await transObj.retryRmbQuery();
    }

    /**
     * 离开状态
     * @param transObj
     */
    async onLeaveState(transObj: RmbTransObj): Promise<void> {
        // 中止人民币订单查询重试计时器
        transObj.clearRetryAlipayQueryTimeout();
    }

    /**
     * 支付成功回调
     * @param transObj
     * @param platformTxId
     */
    async onPaySuccessCallback(transObj: RmbTransObj, platformTxId: string): Promise<void> {
        transObj.platformTxId = platformTxId;
        await transObj.save();
        Logger.debug(`[${transObj.platformName}] txId:${transObj.txId} 支付成功`);
        await transObj.changeState(RMB_TRANS_STATE_ID.SUCCESS, this.getStateId());
    }

    /**
     * 支付失败回调
     * @param transObj
     * @param platformTxId
     * @param errMsg
     */
    async onPayFailCallback(transObj: RmbTransObj, platformTxId: string, errMsg: string): Promise<void> {
        transObj.platformTxId = platformTxId;
        transObj.failReason = errMsg?.substring(0, 900);
        await transObj.save();
        Logger.warn(`[${transObj.platformName}] txId:${transObj.txId} 支付失败. platformTxId:${platformTxId} onPayFailCallback, because of ${errMsg}`);
        await transObj.changeState(RMB_TRANS_STATE_ID.PAY_FAIL, this.getStateId());
    }
}
