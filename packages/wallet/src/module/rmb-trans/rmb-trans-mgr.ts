import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
    CommonHelper,
    RMB_TRANS_STATE_ID,
    Logger,
    rabbitMQCore,
    sleep,
    FSMMgr,
    $noNullMap,
    $asyncAllNoNullMap,
    DefalutPageSize,
    ALIPAY_TRADE_STATUS,
} from "@bnqkl/wallet-sdk";
import { BUSINESS_QUEUE_ROUTING_KEY, RmbTransactions } from "../../common.js";
import { PayFail_RmbTransState, RmbTransState, Success_RmbTransState, WaitPay_RmbTransState } from "./state.js";
import { RmbTransObj } from "./rmb-trans-obj.js";
import { FindOptionsWhere } from "typeorm";
import { RmbTransService } from "./rmb-trans.service.js";
import { businessConsumer } from "../mq.js";

/**人民币交易管理器 */
@Injectable()
export class RmbTransMgr extends FSMMgr<RMB_TRANS_STATE_ID, RmbTransState> implements Wallet.RmbTrans.TransMgr<RmbTransState, RmbTransactions, RmbTransObj> {
    @Inject(forwardRef(() => RmbTransService))
    private __rmbTransService!: RmbTransService;
    @Inject(forwardRef(() => WaitPay_RmbTransState))
    private __waitPay_RmbTransState!: WaitPay_RmbTransState;
    @Inject(forwardRef(() => PayFail_RmbTransState))
    private __payFail_RmbTransState!: PayFail_RmbTransState;
    @Inject(forwardRef(() => Success_RmbTransState))
    private __success_RmbTransState!: Success_RmbTransState;

    /**是否正在处理tick */
    private __processingTick = false;
    /**是否正在处理新区块同步 */
    protected __processingNewBlock = false;
    /**处理中的交易对象集合 */
    protected __processingTransObjMap = new Map<string, RmbTransObj>();

    /**
     * 初始化
     */
    async init(): Promise<void> {
        // 注册state
        this.registerState(this.__waitPay_RmbTransState);
        this.registerState(this.__payFail_RmbTransState);
        this.registerState(this.__success_RmbTransState);
        // 监听事件
        this.listenEvents();
        // 加载交易
        await this.loadTransaction();
        this.tick();
    }

    /**
     * 监听事件
     */
    listenEvents() {}

    /**
     * 处理mq任务
     */
    processMqTask() {
        rabbitMQCore.on("connect", this.processMqConnect.bind(this));
        rabbitMQCore.on("reconnect", this.processMqReConnect.bind(this));
    }

    /**
     * 心跳
     */
    async tick() {
        setInterval(() => {
            Logger.debug(`[RMB] __processingTransObjMap: ${this.__processingTransObjMap.size}`);
        }, 30 * 1000);
        const TICK_INTERVAL = 1000;
        do {
            try {
                this.__onTick();
            } catch (error) {
                Logger.error(error);
            }
            await sleep(TICK_INTERVAL);
        } while (true);
    }

    /**
     * 交易核心逻辑心跳
     */
    async __onTick() {
        if (this.__processingTick) {
            return;
        }
        this.__processingTick = true;
        try {
            await $asyncAllNoNullMap(Array.from(this.__processingTransObjMap.values()), async (transObj) => transObj.onTick());
        } finally {
            this.__processingTick = false;
        }
    }

    newTransObj(trans: RmbTransactions): RmbTransObj {
        return new RmbTransObj(trans, this, this.__rmbTransService);
    }

    /**
     * 获取待处理交易的条件
     */
    getPendingTransOptions(): FindOptionsWhere<RmbTransactions> {
        return { state: RMB_TRANS_STATE_ID.WAIT_PAY };
    }

    /**
     * 获取初始化交易的条件
     */
    getInitTransOptions(): FindOptionsWhere<RmbTransactions> {
        return { state: RMB_TRANS_STATE_ID.INIT, linkType: 0 };
    }

    /**
     * 设置交易为待处理
     * @param trans
     */
    setTransPending(trans: RmbTransactions): void {
        trans.state = RMB_TRANS_STATE_ID.WAIT_PAY;
    }

    /**
     * 处理mq连接事件
     */
    async processMqConnect() {
        // 消费交易通知
        this.__consumeNotifyEvent();
    }

    /**
     * 处理mq重连事件
     */
    async processMqReConnect() {
        for (const { curStateId, txId } of this.__processingTransObjMap.values()) {
            if (curStateId === RMB_TRANS_STATE_ID.WAIT_PAY) {
            }
        }
    }

    /**
     * 加载交易
     */
    async loadTransaction() {
        // 加载待处理的交易
        await this.__loadPendingTransaction();
        // 定期加载初始化的交易，并设置为待处理
        this.__loadInitTransaction();
    }

    /**
     * 加载待处理的交易
     */
    private async __loadPendingTransaction() {
        const options = this.getPendingTransOptions();
        await CommonHelper.pageLoop(
            DefalutPageSize,
            async () => {
                const count = await this.__rmbTransService.repository.countBy(options);
                Logger.debug(`[RMB] processing count: ${count}`);
                return count;
            },
            async (page: number, pageSize: number) => {
                const datas = await this.__rmbTransService.repository.find({ where: options, skip: page * pageSize, take: pageSize });
                return datas;
            },
            async (trans) => {},
            async (page, pageTimeStart, transArray) => {
                await this.__createTransObjs(transArray);
                Logger.debug(`[RMB] __loadPendingTransaction. page:${page} Finish costTime:${Date.now() - pageTimeStart} ms`);
            },
            (timeStart: number) => {
                const costTime = Date.now() - timeStart;
                if (costTime > 5000) {
                    Logger.debug(`[RMB] __loadPendingTransaction costTime: ${costTime} ms`);
                }
            },
        );
    }

    /**
     * 定期加载初始化的交易，并设置为待处理
     */
    private async __loadInitTransaction() {
        const options = this.getInitTransOptions();
        const __load = async () => {
            const MAX_PENDING_COUNT = 5000;
            if (this.__processingTransObjMap.size > MAX_PENDING_COUNT) {
                Logger.debug(
                    `[RMB] don't load init transaction because of __processingTransObjMap.size:${this.__processingTransObjMap.size} > ${MAX_PENDING_COUNT}`,
                );
                return this.__processingTransObjMap.size - MAX_PENDING_COUNT;
            }
            const count = await this.__rmbTransService.repository.countBy(options);
            if (count === 0) {
                return;
            }
            Logger.debug(`[RMB] init count: ${count}`);
            const timeStart = Date.now();
            const transArray = await this.__rmbTransService.repository.find({ where: options, take: MAX_PENDING_COUNT });
            $noNullMap(transArray, (trans) => {
                this.setTransPending(trans);
            });
            await this.__createTransObjs(transArray);
            const costTime = Date.now() - timeStart;
            if (costTime > 5000) {
                Logger.debug(`[RMB] __loadInitTransaction costTime: ${costTime} ms`);
            }
        };
        const TICK_INTERVAL = 1000;
        const OVER_TICK_INTERVAL_UNIT = 20;
        do {
            try {
                const overCount = await __load();
                const interval = overCount ? overCount * OVER_TICK_INTERVAL_UNIT : TICK_INTERVAL;
                if (interval !== TICK_INTERVAL) {
                    Logger.debug(`[RMB] __loadInitTransaction sleep: ${interval} ms`);
                }
                await sleep(interval);
            } catch (err) {
                Logger.error(err);
                await sleep(TICK_INTERVAL);
            }
        } while (true);
    }

    /**
     * 根据txId生成交易逻辑对象
     *
     * @param txId
     */
    async createTransObjById(txId: string) {
        const trans = await this.__rmbTransService.repository.findOneByForce({ entityId: txId });
        return (await this.__createTransObjs(trans))[0];
    }

    /**
     * 批量生成交易逻辑对象
     * @param transArray
     * @returns
     */
    protected async __createTransObjs(transArray: RmbTransactions | RmbTransactions[]) {
        if (!(transArray instanceof Array)) {
            transArray = [transArray];
        }
        const transObjs = $noNullMap(transArray, (trans) => {
            if (this.__getProcessingTrans(trans.entityId)) {
                // 如果已经存在，则不new
                Logger.error(`trans already exist! [RMB] txId:${trans.entityId}`);
                return;
            }
            return this.newTransObj(trans);
        });
        this.__setProcessingTrans(transObjs);
        await $asyncAllNoNullMap(transObjs, async (transObj) => {
            await transObj.init();
        });
        return transObjs;
    }

    /**
     * 获取处理中的交易
     * @param chainName
     * @param txId
     * @returns
     */
    protected __getProcessingTrans(txId: string) {
        const trans = this.__processingTransObjMap.get(txId);
        return trans;
    }

    /**
     * 设置处理中的交易
     * @param transObjs
     */
    private __setProcessingTrans(transObjs: RmbTransObj | RmbTransObj[]) {
        if (!(transObjs instanceof Array)) {
            transObjs = [transObjs];
        }
        transObjs.map((transObj) => {
            const setTransObj = (processingKey: string) => {
                this.__processingTransObjMap.set(processingKey, transObj);
            };
            setTransObj(transObj.txId);
        });
    }

    /**
     * 删除处理中的交易
     * @param txIds
     */
    deleteProcessingTrans(txIds: string | string[]) {
        if (!(txIds instanceof Array)) {
            txIds = [txIds];
        }
        // Logger.warn(`delete: ${txIds}`);
        txIds.map((txId) => this.__processingTransObjMap.delete(txId));
    }

    /**
     * 消费交易通知
     */
    private __consumeNotifyEvent(): void {
        // 消费支付宝交易通知
        businessConsumer.consumeAlipayNotifyEvent(
            BUSINESS_QUEUE_ROUTING_KEY.ALIPAY_NOTIFY,
            async (args) => {
                const { txId, notifyData } = args;
                const transObj = this.__getProcessingTrans(txId);
                if (!transObj) {
                    // 内存中找不到交易，只打印错误，不重试
                    Logger.warn(`couldn't found RMB transObj:${txId} is Processing in ${BUSINESS_QUEUE_ROUTING_KEY.ALIPAY_NOTIFY}`);
                    return;
                }
                await transObj.processAlipayNotifyData(notifyData);
            },
            undefined,
            { expiration: 30 * 1000 },
        );
    }
}
