import { ExternalChainName, ExternalTransStateID } from "@bnqkl/wallet-typings";
import { Injectable } from "@nestjs/common";
import { ExternalTransactionBase } from "../../common/entity.js";
import { ChainTransObj } from "../../common/chain-trans/chain-trans-obj.js";
import { ExternalChainTransMgr } from "./external-chain-trans-mgr.js";
import { ExternalTransState } from "./state.js";

/**外链交易的逻辑对象 */
@Injectable()
export class ExternalChainTransObj
    extends ChainTransObj<ExternalTransStateID, ExternalChainName, ExternalTransState, ExternalTransactionBase>
    implements Wallet.ExternalChain.TransObj
{
    constructor(trans: ExternalTransactionBase, private __externalChainTransMgr: ExternalChainTransMgr) {
        super(trans, __externalChainTransMgr);
    }

    /**交易哈希 */
    get txHash() {
        return this.entity.txHash;
    }
    set txHash(hash: string) {
        this.entity.txHash = hash;
    }

    /**交易体已广播 */
    get isBroadcasted() {
        return this.entity.isBroadcasted;
    }
    set isBroadcasted(value: boolean) {
        this.entity.isBroadcasted = value;
    }

    get trJson() {
        return this.entity.trJson;
    }

    /**
     * 广播交易
     */
    async sdkBroadcastTransaction() {
        const transactionService = this.__externalChainTransMgr.getTransactionService(this.chainName);
        try {
            const txHash = await transactionService.sdkBroadcastTransaction(this.trJson as any);
            await this.onBroadcastSuccessCallback(txHash);
        } catch (e) {
            await this.onChainFailCallback(e.message);
        }
    }

    /**
     * 上链失败回调
     * @param errMsg
     */
    async onChainFailCallback(errMsg: string): Promise<void> {
        await this.curState?.onChainFailCallback(this, errMsg);
    }
}
