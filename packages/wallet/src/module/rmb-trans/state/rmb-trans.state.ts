import { FSMState } from "@bnqkl/wallet-sdk";
import type { RmbTransObj } from "../rmb-trans-obj.js";
import { RMB_TRANS_STATE_ID } from "@bnqkl/wallet-typings";

/**外链交易状态基类 */
export abstract class RmbTransState extends FSMState<RMB_TRANS_STATE_ID> implements Wallet.RmbTrans.TransState {
    constructor(stateId: RMB_TRANS_STATE_ID) {
        super(stateId);
    }

    getStateName() {
        return RMB_TRANS_STATE_ID[this.getStateId()];
    }

    /**
     * 支付成功回调
     * @param transObj
     * @param platformTxId
     */
    async onPaySuccessCallback(transObj: RmbTransObj, platformTxId: string): Promise<void> {
        throw Error(`<${transObj.platformName}> txId:${transObj.txId} platformTxId:${platformTxId} can't onPaySuccessCallback in state:${this.getStateName()}`);
    }

    /**
     * 支付失败回调
     * @param transObj
     * @param platformTxId
     * @param errMsg
     */
    async onPayFailCallback(transObj: RmbTransObj, platformTxId: string, errMsg: string): Promise<void> {
        throw Error(
            `<${transObj.platformName}> txId:${
                transObj.txId
            } platformTxId:${platformTxId} can't onPayFailCallback errMsg:${errMsg} in state:${this.getStateName()}`,
        );
    }
}
