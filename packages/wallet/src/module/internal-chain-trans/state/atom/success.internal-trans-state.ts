import { TRANS_QUEUE_ROUTING_KEY, InternalTransStateID } from "@bnqkl/wallet-sdk";
import { Injectable } from "@nestjs/common";
import { walletPublisher } from "../../../mq/index.js";
import type { InternalChainTransObj } from "../../internal-chain-trans-obj.js";
import { InternalTransFinallyState } from "../internal-trans-finally.state.js";

/**成功状态 */
@Injectable()
export class Success_InternalTransState extends InternalTransFinallyState {
    constructor() {
        super(InternalTransStateID.SUCCESS);
    }

    /**
     * 进入状态
     * @param transObj
     */
    async onEnterState(transObj: InternalChainTransObj): Promise<void> {
        const { chainName, txId, mqId, linkId } = transObj;
        if (linkId && mqId) {
            await walletPublisher.publishOnChainEvent(TRANS_QUEUE_ROUTING_KEY.INTERNAL_SUCCESS, { chainName, entityId: txId }, mqId);
        }
    }
}
