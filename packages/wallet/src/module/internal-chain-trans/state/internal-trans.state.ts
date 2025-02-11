import { InternalChainTransObj } from "../internal-chain-trans-obj";
import { ChainTransState } from "../../../common/chain-trans/chain-trans-state";
import { InternalTransStateID, InternalChainName } from "@bnqkl/wallet-typings";

/**内链交易状态基类 */
export abstract class InternalTransState extends ChainTransState<InternalTransStateID, InternalChainName> implements Wallet.InternalChain.TransState {
    constructor(stateId: InternalTransStateID) {
        super(stateId);
    }

    getStateName() {
        return InternalTransStateID[this.getStateId()];
    }

    /**
     * 上链失败回调
     * @param transObj
     * @param height
     * @param signature
     * @param broadcastResult
     */
    async onChainFailCallback(
        transObj: InternalChainTransObj,
        height: number,
        signature: string,
        broadcastResult: BFMetaNodeSDK.ApiFailureReturn,
    ): Promise<void> {
        throw Error(
            `<${transObj.transType}> txId:${transObj.txId} signature:${signature?.substring(0, 6)} can't onChainFailCallback on height:${height} errorCode:${
                broadcastResult.error.code
            } in state:${this.getStateName()}`,
        );
    }

    /**
     * 同步到某个高度的回调
     * @param transObj
     * @param height
     */
    async onHeightCallback(transObj: InternalChainTransObj, height: number): Promise<void> {
        throw Error(`<${transObj.transType}> txId:${transObj.txId} can't onHeightCallback on height:${height} in state:${this.getStateName()}`);
    }
}
