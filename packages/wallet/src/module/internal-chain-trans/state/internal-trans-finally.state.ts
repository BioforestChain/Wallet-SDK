import { InternalTransStateID } from "@bnqkl/wallet-sdk";
import { InternalChainTransObj } from "../internal-chain-trans-obj.js";
import { InternalTransState } from "./internal-trans.state.js";

/**内链交易最终状态 */
export abstract class InternalTransFinallyState extends InternalTransState {
    constructor(stateId: InternalTransStateID) {
        super(stateId);
    }

    /**
     * 进入状态后置逻辑
     * @param transObj
     */
    async afterEnterState(transObj: InternalChainTransObj): Promise<void> {
        // 关闭交易
        await transObj.close();
    }
}
