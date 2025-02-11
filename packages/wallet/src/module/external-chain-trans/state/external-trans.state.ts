import { ExternalChainTransObj } from "../external-chain-trans-obj";
import { ChainTransState } from "../../../common/chain-trans/chain-trans-state";
import { ExternalChainName, ExternalTransStateID } from "@bnqkl/wallet-typings";

/**外链交易状态基类 */
export abstract class ExternalTransState extends ChainTransState<ExternalTransStateID, ExternalChainName> implements Wallet.ExternalChain.TransState {
    constructor(stateId: ExternalTransStateID) {
        super(stateId);
    }

    getStateName() {
        return ExternalTransStateID[this.getStateId()];
    }

    /**
     * 上链失败回调
     * @param transObj
     * @param errMsg
     */
    async onChainFailCallback(transObj: ExternalChainTransObj, errMsg: string): Promise<void> {
        throw Error(
            `<${transObj.transType}> txId:${transObj.txId} txHash:${transObj.txHash?.substring(
                0,
                6,
            )} can't onChainFailCallback errMsg:${errMsg} in state:${this.getStateName()}`,
        );
    }
}
