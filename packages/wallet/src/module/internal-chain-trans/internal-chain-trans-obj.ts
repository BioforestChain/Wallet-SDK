import { Injectable } from "@nestjs/common";
import { InternalTransactionBase } from "../../common/entity";
import { InternalChainTransMgr } from "./internal-chain-trans-mgr";
import { InternalTransState } from "./state";
import { ChainTransObj } from "../../common/chain-trans/chain-trans-obj";
import { walletPublisher } from "../mq";
import { InternalChainName, InternalTransStateID, TRANS_TEMP_QUEUE_ROUTING_KEY } from "@bnqkl/wallet-sdk";
import { LOCAL_MQ_ID } from "../../common";

/**内链交易的逻辑对象 */
@Injectable()
export class InternalChainTransObj
    extends ChainTransObj<InternalTransStateID, InternalChainName, InternalTransState, InternalTransactionBase>
    implements Wallet.InternalChain.TransObj
{
    /**广播重试计时器id */
    private __retryBroadcastTimeId?: NodeJS.Timeout;

    constructor(trans: InternalTransactionBase, private __internalChainTransMgr: InternalChainTransMgr) {
        super(trans, __internalChainTransMgr);
    }

    get internalTransMgr() {
        return this.__internalChainTransMgr;
    }

    /**内存缓存的key */
    get processingKey() {
        return this.signature;
    }

    /**交易签名 */
    get signature() {
        return this.entity.signature;
    }

    /**交易过期高度 */
    get effectiveBlockHeight() {
        return this.entity.effectiveBlockHeight;
    }

    /**发送者 */
    get senderId() {
        return this.entity.senderId;
    }

    /**接收者 */
    get recipientId() {
        return this.entity.recipientId;
    }

    /**上链时间戳 */
    get onChainTimestamp() {
        return this.entity.onChainTimestamp;
    }
    set onChainTimestamp(timestamp: number) {
        this.entity.onChainTimestamp = timestamp;
    }

    /**
     * 成功确认高度
     */
    get successHeight() {
        return this.entity.successHeight;
    }
    set successHeight(height: number) {
        this.entity.successHeight = height;
    }

    /**
     * 失败确认高度
     */
    get failHeight() {
        return this.entity.failHeight;
    }
    set failHeight(height: number) {
        if (this.entity.failHeight > 0) {
            return;
        }
        this.entity.failHeight = height;
    }

    get retryBroadcastNum() {
        return this.entity.retryBroadcastNum;
    }
    set retryBroadcastNum(num: number) {
        this.entity.retryBroadcastNum = num;
    }

    get trJson() {
        return this.entity.trJson;
    }

    /**
     * 关闭交易
     */
    async close() {
        // 保存
        await this.save();
        // 从处理map中删除
        this.__internalChainTransMgr.deleteProcessingTrans(this.chainName, this.signature);
    }

    /**
     * 重试广播
     */
    async retryBroadcast() {
        // 每5个高度后重试
        const { forgeInterval } = await this.__internalChainTransMgr.getTransactionService(this.chainName).getGenesisAssetInfo();
        this.__retryBroadcastTimeId = setTimeout(async () => {
            // 重新入队去广播事件
            await walletPublisher.publishOnChainEvent(
                TRANS_TEMP_QUEUE_ROUTING_KEY.INTERNAL_ON_CHAIN_START,
                { chainName: this.chainName, entityId: this.signature },
                LOCAL_MQ_ID,
                true,
            );
            this.retryBroadcastNum++;
            // 立即保存
            await this.save();
        }, 5 * forgeInterval * 1000);
    }

    /**中止广播重试计时器 */
    clearRetryBroadcastTimeout() {
        if (this.__retryBroadcastTimeId) {
            clearTimeout(this.__retryBroadcastTimeId);
            this.__retryBroadcastTimeId = undefined;
        }
    }

    /**
     * 广播交易
     */
    async sdkBroadcastTransaction() {
        const transactionService = this.__internalChainTransMgr.getTransactionService(this.chainName);
        const broadcastResult = await transactionService.sdkBroadcastTransaction(this.trJson);
        const height = await transactionService.getRemoteLastBlockHeight();
        if (broadcastResult.success) {
            await this.onBroadcastSuccessCallback(this.trJson.signature);
        } else {
            await this.onChainFailCallback(height, this.trJson.signature, broadcastResult);
        }
        return broadcastResult;
    }

    /**
     * 上链失败回调
     * @param height
     * @param signature
     * @param broadcastResult
     */
    async onChainFailCallback(height: number, signature: string, broadcastResult: BFMetaNodeSDK.ApiFailureReturn): Promise<void> {
        await this.curState?.onChainFailCallback(this, height, signature, broadcastResult);
    }

    /**
     * 同步到某个高度的回调
     * @param height
     */
    async onHeightCallback(height: number) {
        await this.curState?.onHeightCallback(this, height);
    }
}
