import { Injectable } from "@nestjs/common";
import {
    AIRDROP_ORDER_STATE_ID,
    AIRDROP_TYPE,
    COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY,
    INTERNAL_TRANS_RETRY_INVERVAL,
    INTERNAL_TRANS_RETRY_MAX_NUM,
    Logger,
    sleep,
} from "@bnqkl/wallet-sdk";
import type { AirdropOrderObj } from "../../airdrop-order-obj.js";
import { AirdropOrderPendingState } from "../airdrop-order-pending.state.js";
import { LOCAL_MQ_ID, TRANSACTION_LINK_TYPE } from "../../../../../common/index.js";
import { walletPublisher } from "../../../../mq/index.js";
import { AirdropHelper } from "../../../../../helper/index.js";

/**发行交易等待上链状态 */
@Injectable()
export class IssueTxWaitOnChain_AirdropOrderState extends AirdropOrderPendingState {
    constructor() {
        super(AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN);
    }

    /**
     * 心跳
     * @param orderObj
     */
    async onTick(orderObj: AirdropOrderObj): Promise<void> {
        // 重试发行交易
        if (orderObj.retryIssueTxStamp && Date.now() >= orderObj.retryIssueTxStamp) {
            orderObj.retryIssueTxStamp = undefined;
            await walletPublisher.publishCommonOrderEvent(
                COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ISSUE_TX_START,
                { orderId: orderObj.orderId },
                undefined,
                true,
            );
        }
    }

    /**
     * 进入状态
     * @param orderObj
     */
    async onEnterState(orderObj: AirdropOrderObj): Promise<void> {
        const { orderId } = orderObj;
        // 等待mq内链上链相关队列初始化完毕
        this.__memoryService.waitInternalOnChainQueueInited().then(async () => {
            if (orderObj.curStateId !== AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN) {
                // 已更新到最新高度，但state已经不是ISSUE_TX_WAIT_ON_CHAIN，说明同步完成后本订单已经处理过，直接跳过本状态
                return;
            }
            await walletPublisher.publishCommonOrderEvent(COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ISSUE_TX_START, { orderId }, undefined, true);
        });
    }

    /**
     * 开始发行交易上链回调
     * @param orderObj
     */
    async onIssueTxStartCallback(orderObj: AirdropOrderObj): Promise<void> {
        await this.__startIssue(orderObj);
    }

    /**
     * 开始空投发行
     * @param orderObj
     */
    private async __startIssue(orderObj: AirdropOrderObj) {
        const { orderId, type, chainName, issueDpInfo, issueTxId } = orderObj;
        if (issueTxId === orderId) {
            try {
                // 内链平台账户
                const platformAccount = await this.__globalValueRedisRepository.getAirdropAccount(type);
                const { remark, factoryInfo, quantity } = issueDpInfo;
                const issueEntity = async () => {
                    if (type === AIRDROP_TYPE.NORMAL) {
                        const resp = await this.__internalChainTransMgr.createIssueEntity({
                            chainName,
                            secret: platformAccount.secret,
                            recipientId: platformAccount.address,
                            issueEntityInfo: {
                                ...factoryInfo,
                                entityId: AirdropHelper.genIssueEntityId(),
                            },
                            param: {
                                mqId: LOCAL_MQ_ID,
                                linkType: TRANSACTION_LINK_TYPE.AIRDROP_ORDER,
                                linkId: orderId,
                            },
                            remark: { ...remark, data: JSON.stringify(remark.data) },
                        });
                        return resp.txId;
                    }
                    const resp = await this.__internalChainTransMgr.createIssueEntityMulti({
                        chainName,
                        secret: platformAccount.secret,
                        recipientId: platformAccount.address,
                        issueEntityInfo: {
                            ...factoryInfo,
                            entityStructList: AirdropHelper.genIssueEntityMultiStructList(quantity ?? 0, factoryInfo.taxAssetPrealnum),
                        },
                        param: {
                            mqId: LOCAL_MQ_ID,
                            linkType: TRANSACTION_LINK_TYPE.AIRDROP_ORDER,
                            linkId: orderId,
                        },
                        remark: { ...remark, data: JSON.stringify(remark.data) },
                    });
                    return resp.txId;
                };
                orderObj.issueTxId = await issueEntity();
                // 立即保存
                await orderObj.save();
            } catch (e) {
                // 未注入私钥，或发起账户余额不足，或生成交易体失败（可能是maker繁忙），在队列外等待，卡住其他的消费者，降低并发
                await sleep(INTERNAL_TRANS_RETRY_INVERVAL);
                throw e;
            }
        }
        await this.__internalChainTransMgr.createTransObj({ chainName, txId: orderObj.issueTxId });
    }

    /**
     * 校验交易id
     * @param orderObj
     * @param txId
     */
    private __verifyTxId(orderObj: AirdropOrderObj, txId: string) {
        if (txId !== orderObj.issueTxId) {
            throw Error(`txId:${txId} !== orderObj.issueTxId:${orderObj.issueTxId}`);
        }
    }

    /**
     * 内链上链成功回调
     * @param orderObj
     * @param trans
     */
    async onInternalChainSuccessCallback(orderObj: AirdropOrderObj, trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        this.__verifyTxId(orderObj, trans.entityId);
        await orderObj.changeState(AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN, this.getStateId());
    }

    /**
     * 内链上链失败回调
     * @param orderObj
     * @param trans
     */
    async onInternalChainFailCallback(orderObj: AirdropOrderObj, trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        this.__verifyTxId(orderObj, trans.entityId);
        // 发行交易必须成功，否则不断重试
        await this.__retryIssueTx(orderObj);
    }

    /**
     * 重试发行交易
     * @param orderObj
     */
    private async __retryIssueTx(orderObj: AirdropOrderObj) {
        const RETRY_INTERVAL = INTERNAL_TRANS_RETRY_INVERVAL;
        const RETRY_MAX_NUM = INTERNAL_TRANS_RETRY_MAX_NUM;
        // 刷新重试时间戳
        orderObj.retryIssueTxStamp = Date.now() + RETRY_INTERVAL;
        orderObj.issueTxId = orderObj.orderId;
        orderObj.retryIssueTxNum++;
        // 立即保存
        await orderObj.save();
        const txNum = orderObj.retryIssueTxNum;
        if (txNum <= RETRY_MAX_NUM) {
            return;
        }
        // 超过最大重试次数
        Logger.error(`<${orderObj.orderType}> airdropType:${orderObj.airdropType} ${orderObj.orderId} txNum:${txNum} is over ${RETRY_MAX_NUM}`);
        // 进入失败状态
        await orderObj.changeState(AIRDROP_ORDER_STATE_ID.ISSUE_TX_ON_CHAIN_FAIL, this.getStateId());
    }
}
