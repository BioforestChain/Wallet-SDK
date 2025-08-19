import type { RMB_TRANS_STATE_ID } from "@bnqkl/wallet-sdk";
import { forwardRef, Inject } from "@nestjs/common";
import type { RmbTransObj } from "../rmb-trans-obj.js";
import { RmbTransState } from "./rmb-trans.state.js";

/**外链交易最终状态 */
export abstract class RmbTransFinallyState extends RmbTransState {
    constructor(stateId: RMB_TRANS_STATE_ID) {
        super(stateId);
    }

    /**
     * 进入状态后置逻辑
     * @param transObj
     */
    async afterEnterState(transObj: RmbTransObj): Promise<void> {
        // 关闭交易
        await transObj.close();
    }
}
