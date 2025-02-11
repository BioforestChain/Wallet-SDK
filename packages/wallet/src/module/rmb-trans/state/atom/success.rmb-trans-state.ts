import { TRANS_QUEUE_ROUTING_KEY, RMB_TRANS_STATE_ID } from "@bnqkl/wallet-sdk";
import { Injectable } from "@nestjs/common";
import { walletPublisher } from "../../../mq";
import { RmbTransObj } from "../../rmb-trans-obj";
import { RmbTransFinallyState } from "../rmb-trans-finally.state";

/**成功状态 */
@Injectable()
export class Success_RmbTransState extends RmbTransFinallyState {
    constructor() {
        super(RMB_TRANS_STATE_ID.SUCCESS);
    }

    /**
     * 进入状态
     * @param transObj
     */
    async onEnterState(transObj: RmbTransObj): Promise<void> {
        const { txId, mqId, linkId } = transObj;
        if (linkId && mqId) {
            await walletPublisher.publishRmbPayEvent(TRANS_QUEUE_ROUTING_KEY.RMB_PAY_SUCCESS, { entityId: txId }, mqId);
        }
    }
}
