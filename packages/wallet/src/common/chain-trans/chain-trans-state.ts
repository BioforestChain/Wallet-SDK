import { FSMState } from "@bnqkl/wallet-sdk";
import type { ChainTransObj } from "./chain-trans-obj.js";

/**链上交易状态基类 */
export abstract class ChainTransState<StateID extends number, ChainName extends string>
    extends FSMState<StateID>
    implements Wallet.ChainTrans.TransState<StateID>
{
    constructor(stateId: StateID) {
        super(stateId);
    }

    /**
     * 开始上链回调
     * @param transObj
     */
    async onChainStartCallback(transObj: ChainTransObj<StateID, ChainName>): Promise<void> {
        throw Error(`<${transObj.transType}> txId:${transObj.txId} can't onChainStartCallback in state:${this.getStateName()}`);
    }

    /**
     * 广播成功回调
     * @param transObj
     * @param txHash
     */
    async onBroadcastSuccessCallback(transObj: ChainTransObj<StateID, ChainName>, txHash: string): Promise<void> {
        throw Error(
            `<${transObj.transType}> txId:${transObj.txId} txHash:${txHash?.substring(0, 6)} can't onBroadcastSuccessCallback in state:${this.getStateName()}`,
        );
    }

    /**
     * 上链成功回调
     * @param transObj
     * @param height
     * @param txHash
     */
    async onChainSuccessCallback(transObj: ChainTransObj<StateID, ChainName>, height: number, txHash: string): Promise<void> {
        throw Error(
            `<${transObj.transType}> txId:${transObj.txId} txHash:${txHash?.substring(
                0,
                6,
            )} can't onChainSuccessCallback on height:${height} in state:${this.getStateName()}`,
        );
    }
}
