import {
    FSMEntity,
    FSMMgr,
    BaseRepository,
    rabbitMQCore,
    CommonHelper,
    DefalutPageSize,
    Logger,
    $noNullMap,
    sleep,
    $asyncAllNoNullMap,
    RedisLock,
} from "@bnqkl/server-util";
import { FindOptionsWhere } from "typeorm";
import { OrderBaseHelper } from "../helper";
import { OrderObj } from "./order-obj";
import { OrderState } from "./order-state";

/**订单管理器 */
export abstract class OrderMgr<
        StateID extends number,
        State extends OrderState<StateID> = OrderState<StateID>,
        Entity extends FSMEntity<StateID> = FSMEntity<StateID>,
        Obj extends OrderObj<StateID> = OrderObj<StateID>,
        OrderType extends string = string,
    >
    extends FSMMgr<StateID, State>
    implements WalletServerSdk.Order.OrderMgr<StateID, State, Entity, Obj>
{
    abstract repository: BaseRepository<Entity>;

    /**是否正在处理tick */
    private __processingTick = false;
    /**处理中的订单对象集合 */
    protected __processingOrderObjMap = new Map<string, Obj>();

    constructor(public orderType: OrderType) {
        super();
    }

    /**
     * 初始化
     */
    abstract init(): Promise<void>;

    /**
     * 处理mq任务
     */
    processMqTask() {
        rabbitMQCore.on("connect", this.processMqConnect.bind(this));
        rabbitMQCore.on("reconnect", this.processMqReConnect.bind(this));
    }

    /**
     * 处理mq连接事件
     */
    abstract processMqConnect(): Promise<void>;

    /**
     * 处理mq重连事件
     */
    abstract processMqReConnect(): Promise<void>;

    /**
     * 获取待处理订单的条件
     */
    abstract getPendingOrderOptions(): FindOptionsWhere<Entity>;

    /**
     * 获取初始化订单的条件
     */
    abstract getInitOrderOptions(): FindOptionsWhere<Entity>;

    /**
     * 设置订单为待处理
     * @param order
     */
    abstract setOrderPending(order: Entity): void;

    /**
     * 加载订单
     */
    async loadOrder() {
        // 加载待处理的订单
        await this.__loadPendingOrder();
        // 定期加载初始化的订单，并设置为待处理
        this.__loadInitOrder();
    }

    /**
     * 加载待处理的订单
     */
    private async __loadPendingOrder() {
        const options = this.getPendingOrderOptions();
        await CommonHelper.pageLoop(
            DefalutPageSize,
            async () => {
                const count = await this.repository.countBy(options);
                Logger.debug(`<${this.orderType}> processing count: ${count}`);
                return count;
            },
            async (page: number, pageSize: number) => {
                const datas = await this.repository.find({ where: options, skip: page * pageSize, take: pageSize });
                return datas;
            },
            async (order) => {},
            async (page, pageTimeStart, orders) => {
                await this.__createOrderObjs(orders);
                Logger.debug(`<${this.orderType}> __loadPendingOrder. page:${page} Finish costTime:${Date.now() - pageTimeStart} ms`);
            },
            (timeStart: number) => {
                const costTime = Date.now() - timeStart;
                if (costTime > 5000) {
                    Logger.debug(`<${this.orderType}> __loadPendingOrder costTime: ${costTime} ms`);
                }
            },
        );
    }

    /**
     * 定期加载初始化的订单，并设置为待处理
     */
    private async __loadInitOrder() {
        const options = this.getInitOrderOptions();
        const __load = async () => {
            const MAX_PENDING_COUNT = 10000;
            if (this.__processingOrderObjMap.size > MAX_PENDING_COUNT) {
                Logger.debug(
                    `<${this.orderType}> don't load init order because of this.__processingOrderObjMap.size:${this.__processingOrderObjMap.size} > ${MAX_PENDING_COUNT}`,
                );
                return this.__processingOrderObjMap.size - MAX_PENDING_COUNT;
            }
            const count = await this.repository.countBy(options);
            if (count === 0) {
                return;
            }
            Logger.debug(`<${this.orderType}> init count: ${count}`);
            const timeStart = Date.now();
            const orderArray = await this.repository.find({ where: options, take: MAX_PENDING_COUNT });
            $noNullMap(orderArray, (order) => {
                this.setOrderPending(order);
            });
            await this.__createOrderObjs(orderArray);
            const costTime = Date.now() - timeStart;
            if (costTime > 5000) {
                Logger.debug(`<${this.orderType}> __loadInitOrder costTime: ${costTime} ms`);
            }
        };
        const TICK_INTERVAL = 1000;
        const OVER_TICK_INTERVAL_UNIT = 20;
        do {
            try {
                const overCount = await __load();
                const interval = overCount ? overCount * OVER_TICK_INTERVAL_UNIT : TICK_INTERVAL;
                if (interval !== TICK_INTERVAL) {
                    Logger.debug(`<${this.orderType}> __loadInitOrder sleep: ${interval} ms`);
                }
                await sleep(interval);
            } catch (err) {
                Logger.error(err);
                await sleep(TICK_INTERVAL);
            }
        } while (true);
    }

    /**
     * 心跳
     */
    async tick() {
        setInterval(() => {
            Logger.debug(`<${this.orderType}> processingOrderObjMap: ${this.__processingOrderObjMap.size}`);
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
     * 订单核心逻辑心跳
     */
    private async __onTick() {
        if (this.__processingTick) {
            return;
        }
        this.__processingTick = true;
        try {
            // Logger.debug(`<${this.orderType}> processingOrderObjMap: ${this.__processingOrderObjMap.size}`);
            await $asyncAllNoNullMap(Array.from(this.__processingOrderObjMap.values()), async (orderObj) => {
                const lockKey = OrderBaseHelper.getOrderLockKey(orderObj.orderId);
                await RedisLock.processByLock(lockKey, async () => orderObj.onTick());
            });
        } finally {
            this.__processingTick = false;
        }
    }

    /**
     * 根据订单id生成订单逻辑对象
     * @param orderId
     */
    async createOrderObjById(orderId: string) {
        const order = await this.repository.findOneByForce({ entityId: orderId } as FindOptionsWhere<Entity>);
        return (await this.__createOrderObjs(order))[0];
    }

    /**
     * 创建订单逻辑对象
     * @param order
     */
    abstract newOrderObj(order: Entity): Obj;

    /**
     * 生成订单逻辑对象
     * @param orderArray
     * @returns
     */
    protected async __createOrderObjs(orderArray: Entity | Entity[]) {
        if (!(orderArray instanceof Array)) {
            orderArray = [orderArray];
        }
        const orderObjs = $noNullMap(orderArray, (order) => {
            if (this.__getProcessingOrder(order.entityId)) {
                // 如果已经存在，则不new
                Logger.warn(`__createOrderObjs fail. order:${JSON.stringify(order)}`);
                return;
            }
            return this.newOrderObj(order);
        });
        this.__setProcessingOrder(orderObjs);
        await $asyncAllNoNullMap(orderObjs, async (orderObj) => {
            await orderObj.init();
        });
        return orderObjs;
    }

    /**
     * 获取处理中的订单
     * @param orderId
     * @returns
     */
    protected __getProcessingOrder(orderId?: string) {
        return orderId ? this.__processingOrderObjMap.get(orderId) : undefined;
    }

    /**
     * 设置处理中的订单
     * @param orderObjs
     */
    private __setProcessingOrder(orderObjs: Obj | Obj[]) {
        if (!(orderObjs instanceof Array)) {
            orderObjs = [orderObjs];
        }
        orderObjs.map((orderObj) => {
            this.__processingOrderObjMap.set(orderObj.orderId, orderObj);
        });
    }

    /**
     * 删除处理中的订单
     * @param orderIds
     */
    deleteProcessingOrder(orderIds: string | string[]) {
        if (!(orderIds instanceof Array)) {
            orderIds = [orderIds];
        }
        orderIds.map((orderId) => this.__processingOrderObjMap.delete(orderId));
    }

    /**
     * 外链上链回调
     * @param success
     * @param trans
     */
    async onExternalChainCallback(success: boolean, trans: WalletTypings.ExternalChain.TransactionBase) {
        const orderId = trans.linkId;
        if (!orderId) {
            Logger.warn(`<${this.orderType}> onExternalChainCallback orderId is undefined`);
            return;
        }
        const orderObj = this.__getProcessingOrder(orderId);
        if (!orderObj) {
            // 内存中找不到订单，只打印错误，不重试
            Logger.warn(`<${this.orderType}> couldn't found orderObj:${orderId} is Processing in onExternalChainCallback`);
            return;
        }
        const lockKey = OrderBaseHelper.getOrderLockKey(orderId);
        await RedisLock.processByLock(lockKey, async () => {
            if (success) {
                Logger.debug(`<${this.orderType}> orderId:${orderObj.orderId} 外链事件上链成功`);
                await orderObj.onExternalChainSuccessCallback(trans);
                return;
            }
            Logger.warn(`<${this.orderType}> orderId:${orderObj.orderId} 外链事件上链失败`);
            await orderObj.onExternalChainFailCallback(trans);
        });
    }

    /**
     * 内链上链回调
     * @param success
     * @param trans
     */
    async onInternalChainCallback(success: boolean, trans: WalletTypings.InternalChain.TransactionBase) {
        const orderId = trans.linkId;
        if (!orderId) {
            Logger.warn(`<${this.orderType}> onInternalChainCallback orderId is undefined`);
            return;
        }
        const orderObj = this.__getProcessingOrder(orderId);
        if (!orderObj) {
            // 内存中找不到订单，只打印错误，不重试
            Logger.warn(`<${this.orderType}> couldn't found orderObj:${orderId} is Processing in onInternalChainCallback`);
            return;
        }
        const lockKey = OrderBaseHelper.getOrderLockKey(orderId);
        await RedisLock.processByLock(lockKey, async () => {
            if (success) {
                Logger.debug(`<${this.orderType}> orderId:${orderObj.orderId} txId:${trans.entityId} 内链事件上链成功`);
                await orderObj.onInternalChainSuccessCallback(trans);
                return;
            }
            Logger.warn(`<${this.orderType}> orderId:${orderObj.orderId} txId:${trans.entityId} 内链事件上链失败`);
            await orderObj.onInternalChainFailCallback(trans);
        });
    }

    /**
     * 支付人民币回调
     * @param success
     * @param trans
     */
    async onPayRmbCallback(success: boolean, trans: WalletTypings.Rmb.TransactionBase) {
        const orderId = trans.linkId;
        if (!orderId) {
            Logger.warn(`<${this.orderType}> onPayRmbCallback orderId is undefined`);
            return;
        }
        const orderObj = this.__getProcessingOrder(orderId);
        if (!orderObj) {
            // 内存中找不到订单，只打印错误，不重试
            Logger.warn(`<${this.orderType}> couldn't found orderObj:${orderId} is Processing in onPayRmbCallback`);
            return;
        }
        const lockKey = OrderBaseHelper.getOrderLockKey(orderId);
        await RedisLock.processByLock(lockKey, async () => {
            if (success) {
                Logger.debug(`<${this.orderType}> orderId:${orderObj.orderId} 支付人民币成功`);
                await orderObj.onPayRmbSuccessCallback(trans);
                return;
            }
            Logger.warn(`<${this.orderType}> orderId:${orderObj.orderId} 支付人民币失败`);
            await orderObj.onPayRmbFailCallback(trans);
        });
    }

    /**
     * 处理订单完成逻辑
     */
    abstract processOrderDone(): void;
}
