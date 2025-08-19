import type { AIRDROP_ORDER_STATE_ID } from "@bnqkl/wallet-sdk";
import type { AirdropOrderObj } from "../airdrop-order-obj.js";
import { AirdropOrderState } from "./airdrop-order.state.js";

/**空投订单最终状态 */
export abstract class AirdropOrderFinallyState extends AirdropOrderState {
    constructor(stateId: AIRDROP_ORDER_STATE_ID) {
        super(stateId);
    }

    /**
     * 进入状态后置逻辑
     * @param orderObj
     */
    async afterEnterState(orderObj: AirdropOrderObj): Promise<void> {
        // 关闭订单
        await orderObj.close();
    }
}
