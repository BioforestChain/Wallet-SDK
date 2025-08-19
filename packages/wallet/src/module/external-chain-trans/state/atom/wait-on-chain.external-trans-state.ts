import { TRANS_TEMP_QUEUE_ROUTING_KEY, ExternalTransStateID } from "@bnqkl/wallet-sdk";
import { Injectable } from "@nestjs/common";
import { Logger } from "@bnqkl/wallet-sdk";
import { ExternalChainTransObj } from "../../external-chain-trans-obj.js";
import { ExternalTransState } from "../external-trans.state.js";
import { walletPublisher } from "../../../mq.js";
import { LOCAL_MQ_ID } from "../../../../common.js";

/**等待上链状态 */
@Injectable()
export class WaitOnChain_ExternalTransState extends ExternalTransState {
    constructor() {
        super(ExternalTransStateID.WAIT_ON_CHAIN);
    }

    /**
     * 进入状态前置逻辑
     * @param transObj
     */
    async beforeEnterState(transObj: ExternalChainTransObj): Promise<void> {
        // 保存state
        await transObj.saveState();
    }

    /**
     * 进入状态
     * @param transObj
     */
    async onEnterState(transObj: ExternalChainTransObj): Promise<void> {
        const { chainName, txId, isBroadcasted } = transObj;
        if (!isBroadcasted) {
            await walletPublisher.publishOnChainEvent(TRANS_TEMP_QUEUE_ROUTING_KEY.EXTERNAL_ON_CHAIN_START, { chainName, entityId: txId }, LOCAL_MQ_ID, true);
        }
    }

    /**
     * 开始上链回调
     * @param transObj
     */
    async onChainStartCallback(transObj: ExternalChainTransObj): Promise<void> {
        // 广播交易
        await transObj.sdkBroadcastTransaction();
    }

    /**
     * 广播成功回调
     * @param transObj
     * @param txHash
     */
    async onBroadcastSuccessCallback(transObj: ExternalChainTransObj, txHash: string): Promise<void> {
        Logger.info(`[${transObj.chainName}] 广播交易 ${txHash?.substring(0, 6)} 成功 `);
        transObj.isBroadcasted = true;
        await transObj.save();
    }

    /**
     * 校验交易哈希
     * @param transObj
     * @param txId
     */
    private __verifyTxHash(transObj: ExternalChainTransObj, txHash: string) {
        if (txHash !== transObj.txHash) {
            throw Error(`[${transObj.chainName}] txHash !== transObj.txHash`);
        }
    }

    /**
     * 上链成功回调
     * @param transObj
     * @param height
     * @param txHash
     */
    async onChainSuccessCallback(transObj: ExternalChainTransObj, height: number, txHash: string): Promise<void> {
        this.__verifyTxHash(transObj, txHash);
        Logger.debug(`[${transObj.chainName}] on height:${height} txId:${transObj.txId} 事件上链成功`);
        await transObj.changeState(ExternalTransStateID.SUCCESS, this.getStateId());
    }

    /**
     * 上链失败回调
     * @param transObj
     * @param errMsg
     */
    async onChainFailCallback(transObj: ExternalChainTransObj, errMsg: string): Promise<void> {
        transObj.failReason = errMsg?.substring(0, 900);
        Logger.warn(
            `[${transObj.chainName}] txId:${transObj.txId} 事件上链失败. ${transObj.txHash?.substring(0, 6)} onChainFailCallback, because of ${errMsg}`,
        );
        await transObj.changeState(ExternalTransStateID.ON_CHAIN_FAIL, this.getStateId());
    }
}
