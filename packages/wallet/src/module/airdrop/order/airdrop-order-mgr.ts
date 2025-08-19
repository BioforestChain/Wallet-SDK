import { forwardRef, Inject, Injectable } from "@nestjs/common";
import type {
    AirdropOrderState} from "./state/index.js";
import {
    Success_AirdropOrderState,
    TransferTxOnChainFail_AirdropOrderState,
    TransferTxWaitOnChain_AirdropOrderState,
    IssueTxWaitOnChain_AirdropOrderState,
    IssueTxOnChainFail_AirdropOrderState
} from "./state/index.js";
import { AirdropOrderObj } from "./airdrop-order-obj.js";
import { AirdropOrderRepository, AirdropTransferTxRepository } from "../airdrop.repository.js";
import type { FindOptionsWhere} from "typeorm";
import { In } from "typeorm";
import { OrderMgr, AIRDROP_ORDER_STATE_ID, COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY, Logger, COMMON_ORDER_QUEUE_ROUTING_KEY } from "@bnqkl/wallet-sdk";
import { AirdropService } from "../airdrop.service.js";
import type { AirdropOrder} from "../../../common/index.js";
import { LOCAL_MQ_ID, ORDER_TYPE } from "../../../common/index.js";
import { GlobalValueRedisRepository } from "../../redis/index.js";
import { OrderHelper } from "../../../helper/index.js";
import { walletConsumer, walletPublisher } from "../../mq/index.js";

/**空投订单管理器 */
@Injectable()
export class AirdropOrderMgr extends OrderMgr<AIRDROP_ORDER_STATE_ID, AirdropOrderState, AirdropOrder, AirdropOrderObj, ORDER_TYPE> {
    @Inject(forwardRef(() => AirdropOrderRepository))
    public readonly repository!: AirdropOrderRepository;
    @Inject(forwardRef(() => AirdropTransferTxRepository))
    public readonly transferTxRepository!: AirdropTransferTxRepository;
    @Inject(forwardRef(() => IssueTxWaitOnChain_AirdropOrderState))
    private __issueTxWaitOnChain_AirdropOrderState!: IssueTxWaitOnChain_AirdropOrderState;
    @Inject(forwardRef(() => IssueTxOnChainFail_AirdropOrderState))
    private __issueTxOnChainFail_AirdropOrderState!: IssueTxOnChainFail_AirdropOrderState;
    @Inject(forwardRef(() => TransferTxWaitOnChain_AirdropOrderState))
    private __transferTxWaitOnChain_AirdropOrderState!: TransferTxWaitOnChain_AirdropOrderState;
    @Inject(forwardRef(() => TransferTxOnChainFail_AirdropOrderState))
    private __transferTxOnChainFail_AirdropOrderState!: TransferTxOnChainFail_AirdropOrderState;
    @Inject(forwardRef(() => Success_AirdropOrderState))
    private __success_AirdropOrderState!: Success_AirdropOrderState;
    @Inject(forwardRef(() => AirdropService))
    private __airdropService!: AirdropService;
    @Inject(forwardRef(() => GlobalValueRedisRepository))
    private __globalValueRedisRepository!: GlobalValueRedisRepository;

    constructor() {
        super(ORDER_TYPE.AIRDROP);
    }

    /**
     * 获取待处理订单的条件
     */
    getPendingOrderOptions(): FindOptionsWhere<AirdropOrder> {
        return { state: In([AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN, AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN]) };
    }

    /**
     * 获取初始化订单的条件
     */
    getInitOrderOptions(): FindOptionsWhere<AirdropOrder> {
        return { state: AIRDROP_ORDER_STATE_ID.INIT };
    }

    /**
     * 设置订单为待处理
     * @param order
     */
    setOrderPending(order: AirdropOrder): void {
        order.state = AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN;
    }

    newOrderObj(order: AirdropOrder): AirdropOrderObj {
        return new AirdropOrderObj(order, this, this.repository, this.transferTxRepository);
    }

    /**
     * 初始化
     */
    async init(): Promise<void> {
        // 注册state
        this.registerState(this.__issueTxWaitOnChain_AirdropOrderState);
        this.registerState(this.__issueTxOnChainFail_AirdropOrderState);
        this.registerState(this.__transferTxWaitOnChain_AirdropOrderState);
        this.registerState(this.__transferTxOnChainFail_AirdropOrderState);
        this.registerState(this.__success_AirdropOrderState);
        // 加载订单
        await this.loadOrder();
        this.tick();
    }

    /**
     * 处理mq连接事件
     */
    async processMqConnect() {
        // 处理空投订单临时队列
        this.__processOrderTempQueue();
        // 处理订单完成逻辑
        this.processOrderDone();
    }

    /**
     * 处理mq重连事件
     */
    async processMqReConnect() {
        for (const { curStateId, orderId } of this.__processingOrderObjMap.values()) {
            if (curStateId === AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN) {
                await walletPublisher.publishCommonOrderEvent(COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ISSUE_TX_START, { orderId }, undefined, true);
            } else if (curStateId === AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN) {
                await walletPublisher.publishCommonOrderEvent(
                    COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ENTER_TRANSFER_STATE,
                    { orderId },
                    undefined,
                    true,
                );
            }
        }
    }

    /**
     * 处理空投订单临时队列
     */
    private __processOrderTempQueue(): void {
        // 空投订单开始发行交易上链
        walletConsumer.consumeCommonOrderEvent(
            COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ISSUE_TX_START,
            async ({ orderId }) => {
                const orderObj = this.__getProcessingOrder(orderId);
                if (!orderObj) {
                    // 内存中找不到订单，只打印错误，不重试
                    Logger.warn(`couldn't found orderObj:${orderId} is Processing in ${COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ISSUE_TX_START}`);
                    return;
                }
                await orderObj.onIssueTxStartCallback();
            },
            LOCAL_MQ_ID,
            true,
            { expiration: 30 * 1000 },
        );
        // 空投订单进入转移状态
        walletConsumer.consumeCommonOrderEvent(
            COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ENTER_TRANSFER_STATE,
            async ({ orderId }) => {
                const orderObj = this.__getProcessingOrder(orderId);
                if (!orderObj) {
                    // 内存中找不到订单，只打印错误，不重试
                    Logger.warn(
                        `couldn't found orderObj:${orderId} is Processing in ${COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_ENTER_TRANSFER_STATE}`,
                    );
                    return;
                }
                await orderObj.onEnterTransferStateCallback();
            },
            LOCAL_MQ_ID,
            true,
            { expiration: 30 * 1000 },
        );
        // 空投订单开始转移交易上链
        walletConsumer.consumeCommonOrderEvent(
            COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_TRANSFER_TX_START,
            async ({ orderId, params }) => {
                const orderObj = this.__getProcessingOrder(orderId);
                if (!orderObj) {
                    // 内存中找不到订单，只打印错误，不重试
                    Logger.warn(`couldn't found orderObj:${orderId} is Processing in ${COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY.AIRDROP_ORDER_TRANSFER_TX_START}`);
                    return;
                }
                if (!params || !params.transferDpTxId) {
                    Logger.warn(`transferDpTxId is undefined`);
                    return;
                }
                await orderObj.onTransferTxStartCallback(params.transferDpTxId);
            },
            LOCAL_MQ_ID,
            true,
            { expiration: 30 * 1000 },
        );
    }

    /**
     * 处理订单完成逻辑
     */
    processOrderDone(): void {
        // 处理空投订单成功
        const successRoutingKey = COMMON_ORDER_QUEUE_ROUTING_KEY.AIRDROP_ORDER_SUCCESS;
        walletConsumer.consumeCommonOrderEvent(
            successRoutingKey,
            async (args) => {
                const { orderId } = args;
                if (await this.__globalValueRedisRepository.isConsumeComplete(successRoutingKey, args)) {
                    // 已经消费过，直接返回
                    Logger.warn(`consume repeat ${successRoutingKey}. orderId:${orderId}`);
                    return;
                }
                const { type } = await this.repository.findOneForce({ where: { entityId: orderId } });
                await this.__globalValueRedisRepository.setConsumeComplete(successRoutingKey, args);
                Logger.debug(`${OrderHelper.getAirdropTypeName(type)}订单: ${orderId} 处理成功完成！`);
            },
            LOCAL_MQ_ID,
            undefined,
            undefined,
            async (args) => {
                await this.__globalValueRedisRepository.delConsumeComplete(successRoutingKey, args);
            },
        );
        // 处理空投订单失败
        const failRoutingKey = COMMON_ORDER_QUEUE_ROUTING_KEY.AIRDROP_ORDER_FAIL;
        walletConsumer.consumeCommonOrderEvent(
            failRoutingKey,
            async (args) => {
                const { orderId } = args;
                if (await this.__globalValueRedisRepository.isConsumeComplete(failRoutingKey, args)) {
                    // 已经消费过，直接返回
                    Logger.warn(`consume repeat ${failRoutingKey}. orderId:${orderId}`);
                    return;
                }
                const { type } = await this.repository.findOneForce({ where: { entityId: orderId } });
                await this.__globalValueRedisRepository.setConsumeComplete(failRoutingKey, args);
                Logger.debug(`${OrderHelper.getAirdropTypeName(type)}订单: ${orderId} 处理失败完成！`);
            },
            LOCAL_MQ_ID,
            undefined,
            undefined,
            async (args) => {
                await this.__globalValueRedisRepository.delConsumeComplete(failRoutingKey, args);
            },
        );
    }
}
