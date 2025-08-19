import { Injectable } from "@nestjs/common";
import { InternalChainTransObj } from "../../internal-chain-trans-obj.js";
import { InternalTransState } from "../internal-trans.state.js";
import { walletPublisher } from "../../../mq.js";
import { TRANS_TEMP_QUEUE_ROUTING_KEY, InternalTransStateID, Logger } from "@bnqkl/wallet-sdk";
import { LOCAL_MQ_ID } from "../../../../common.js";

/**规定了这些类型是失败的 */
export const FAIL_CODE = new Set([
    /**通用不匹配 */
    "001-00004",
    /**参数丢失 */
    "001-11001",
    /**账户已经冻结 */
    "001-11002",
    /**事件的安全签名是必须的 */
    "001-11003",
    /**事件的发起高度不合法 */
    "001-11007",
    /**事件的有效高度不合法 */
    "001-11008",
    /**事件的来源链的网络标识符不合法 */
    "001-11009",
    /**事件的去往链的网络标识符不合法 */
    "001-11010",
    /**事件的时间戳不合法 */
    "001-11011",
    /**DAppid 已经存在 */
    "001-11013",
    /**Entity factory 已经存在 */
    "001-11017",
    /**Entity 已经存在 */
    "001-11019",
    /**未知的 rangeType */
    "001-11020",
    /**事件的字节数不合法 */
    "001-11021",
    /**不能销毁位名 */
    "001-11025",
    /**冻结的权益已经过期 */
    "001-11031",
    /**赠送权益的被解冻次数已经用完 */
    "001-11032",
    /**用户名已经存在 */
    "001-11033",
    /**账户已经是受托人 */
    "001-11034",
    /**位名或者资产名被禁用 */
    "001-11038",
    /** "DAppid 尚未冻结 */
    "001-11043",
    /** "位名尚未冻结 */
    "001-11045",
    /** "Entity 尚未冻结 */
    "001-11047",
    /**只有顶级位名可以交换 */
    "001-11050",
    /**Entity 已经销毁 */
    "001-11052",
    /**权益已经迁移 */
    "001-11053",
    /**关联交易不存在或者已过期 */
    "001-11054",
    /**事件不是预期的关联事件 */
    "001-11055",
    /**不能二次使用同一笔事件 */
    "001-11056",
    /**受托人不能迁移权益 */
    "001-11058",
    /**你只能迁移主权益 */
    "001-11059",
    /**账户不能被冻结 */
    "001-11067",
    /**只能见证主权益 */
    "001-11068",
    /**账户已经设置了用户名 */
    "001-11069",
    /**模板发行 entity 的次数用完 */
    "001-11070",
    /**权益已经存在 */
    "001-11071",
    /**字段不匹配 */
    "001-00010",
    /**资产已被冻结或过期 */
    "001-11072",
    /**模板没有足够的发行 entity 次数 */
    "001-11073",
    /**pc高度验证失败 */
    "002-01014",
    /**事件手续费不足 */
    "002-41011",
]);

/**不报错的CODE */
export const IGNORE_ERROR_CODE = new Set([
    /**已经存在 */
    "001-00034",
]);

/**等待上链状态 */
@Injectable()
export class WaitOnChain_InternalTransState extends InternalTransState {
    constructor() {
        super(InternalTransStateID.WAIT_ON_CHAIN);
    }

    /**
     * 进入状态前置逻辑
     * @param transObj
     */
    async beforeEnterState(transObj: InternalChainTransObj): Promise<void> {
        // 保存state
        await transObj.saveState();
    }

    /**
     * 进入状态
     * @param transObj
     */
    async onEnterState(transObj: InternalChainTransObj): Promise<void> {
        const { internalTransMgr, chainName, signature } = transObj;
        // 等待本地更新到最新高度
        internalTransMgr.waitLocalUpdateToLatest(chainName).then(async () => {
            if (transObj.curStateId !== InternalTransStateID.WAIT_ON_CHAIN) {
                // 已更新到最新高度，但stage已经不是watiOnChain，说明同步完成后本交易已经上链成功或失败，直接跳过本状态，不广播事件
                return;
            }
            await walletPublisher.publishOnChainEvent(
                TRANS_TEMP_QUEUE_ROUTING_KEY.INTERNAL_ON_CHAIN_START,
                { chainName, entityId: signature },
                LOCAL_MQ_ID,
                true,
            );
        });
    }

    /**
     * 离开状态
     * @param transObj
     */
    async onLeaveState(transObj: InternalChainTransObj): Promise<void> {
        // 中止广播重试计时器
        transObj.clearRetryBroadcastTimeout();
    }

    /**
     * 开始上链回调
     * @param transObj
     */
    async onChainStartCallback(transObj: InternalChainTransObj): Promise<void> {
        // 广播交易
        await transObj.sdkBroadcastTransaction();
    }

    /**
     * 广播成功回调
     * @param transObj
     * @param signature
     */
    async onBroadcastSuccessCallback(transObj: InternalChainTransObj, signature: string): Promise<void> {
        const shortSignature = signature?.substring(0, 6);
        Logger.info(`[${transObj.chainName}] 广播交易 ${shortSignature} 成功 `);
        await transObj.retryBroadcast();
    }

    /**
     * 校验交易签名
     * @param transObj
     * @param signature
     */
    private __verifyTxSignature(transObj: InternalChainTransObj, signature: string) {
        if (signature !== transObj.signature) {
            throw Error(`[${transObj.chainName}] signature !== transObj.signature`);
        }
    }

    /**
     * 上链成功回调
     * @param transObj
     * @param height
     * @param signature
     */
    async onChainSuccessCallback(transObj: InternalChainTransObj, height: number, signature: string): Promise<void> {
        this.__verifyTxSignature(transObj, signature);
        const { internalTransMgr, chainName, txId } = transObj;
        const timestamp = await internalTransMgr.getTransactionService(chainName).getBlockTimeStampByHeight(height);
        // 设置上链成功高度和时间戳
        transObj.successHeight = height;
        transObj.onChainTimestamp = timestamp;
        Logger.debug(`[${chainName}] on height:${height} txId:${txId} 事件上链成功`);
        await transObj.changeState(InternalTransStateID.SUCCESS, this.getStateId());
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
        this.__verifyTxSignature(transObj, signature);
        const errorCode = broadcastResult.error.code;
        if (!errorCode) {
            return;
        }
        transObj.failReason = broadcastResult.error.message?.substring(0, 900);
        if (!IGNORE_ERROR_CODE.has(errorCode)) {
            Logger.warn(
                `[${transObj.chainName}] on height:${height} ${signature?.substring(0, 6)} onChainFailCallback, because of ${JSON.stringify(
                    broadcastResult.error,
                    null,
                    2,
                )}`,
            );
        }
        if (FAIL_CODE.has(errorCode)) {
            // 直接失败的错误码
            transObj.failHeight = height;
            // 立即保存
            await transObj.save();
            return;
        }
        // 还有救，需要不断重试广播的错误码
        await transObj.retryBroadcast();
    }

    /**
     * 同步到某个高度的回调
     * @param transObj
     * @param height
     */
    async onHeightCallback(transObj: InternalChainTransObj, height: number): Promise<void> {
        // 1.处理直接失败
        if (transObj.failHeight > 0 && height > transObj.failHeight) {
            Logger.warn(`[${transObj.chainName}] txId:${transObj.txId} 事件上链失败`);
            await transObj.changeState(InternalTransStateID.ON_CHAIN_FAIL, this.getStateId());
        }
        // 2.处理高度过期
        if (height > transObj.effectiveBlockHeight) {
            Logger.warn(`[${transObj.chainName}] txId:${transObj.txId} 事件上链过期`);
            await transObj.changeState(InternalTransStateID.ON_CHAIN_FAIL, this.getStateId());
        }
    }
}
