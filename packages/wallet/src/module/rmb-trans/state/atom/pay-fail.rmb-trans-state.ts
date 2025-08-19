import { TRANS_QUEUE_ROUTING_KEY, RMB_TRANS_STATE_ID } from "@bnqkl/wallet-sdk";
import { Injectable } from "@nestjs/common";
import { walletPublisher } from "../../../mq.js";
import { RmbTransObj } from "../../rmb-trans-obj.js";
import { RmbTransFinallyState } from "../rmb-trans-finally.state.js";

/**支付失败状态 */
@Injectable()
export class PayFail_RmbTransState extends RmbTransFinallyState {
    constructor() {
        super(RMB_TRANS_STATE_ID.PAY_FAIL);
    }

    /**
     * 进入状态
     * @param transObj
     */
    async onEnterState(transObj: RmbTransObj): Promise<void> {
        const { txId, mqId, linkId } = transObj;
        if (linkId && mqId) {
            await walletPublisher.publishRmbPayEvent(TRANS_QUEUE_ROUTING_KEY.RMB_PAY_FAIL, { entityId: txId }, mqId);
        }
    }
}
