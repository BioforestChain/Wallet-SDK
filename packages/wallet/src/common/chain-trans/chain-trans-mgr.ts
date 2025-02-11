import { $asyncAllNoNullMap, $noNullMap, sleep, CommonHelper, Logger, rabbitMQCore, DefalutPageSize, FSMMgr } from "@bnqkl/wallet-sdk";
import { ChainTransEntity } from "../entity/chain-trans.entity";
import { ChainTransObj } from "./chain-trans-obj";
import { ChainTransState } from "./chain-trans-state";
import { ChainTransServiceBase } from "./chain-trans-service";
import { FindOptionsWhere } from "typeorm";
import { CHAIN_TRANS_TYPE } from "../constants";

/**链上交易管理器 */
export abstract class ChainTransMgr<
        StateID extends number,
        ChainName extends string,
        State extends ChainTransState<StateID, ChainName> = ChainTransState<StateID, ChainName>,
        Entity extends ChainTransEntity<StateID, ChainName> = ChainTransEntity<StateID, ChainName>,
        Obj extends ChainTransObj<StateID, ChainName> = ChainTransObj<StateID, ChainName>,
    >
    extends FSMMgr<StateID, State>
    implements Wallet.ChainTrans.TransMgr<StateID, ChainName, State, Entity, Obj>
{
    /**是否正在处理tick */
    private __processingTick = false;
    /**是否正在处理新区块同步 */
    protected __processingNewBlockMap = new Map<ChainName, boolean>();
    /**处理中的交易对象集合 */
    protected __processingTransObjMap = new Map<ChainName, Map<string, Obj>>();

    constructor(public transType: CHAIN_TRANS_TYPE) {
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

    printMap() {
        for (const [chainName, transObjMap] of this.__processingTransObjMap) {
            Logger.debug(`[${chainName}] transObjMap: ${transObjMap.size}`);
        }
    }

    /**
     * 心跳
     */
    async tick() {
        setInterval(() => {
            this.printMap();
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
            await $asyncAllNoNullMap(Array.from(this.__processingTransObjMap.values()), async (transObjMap) => {
                await $asyncAllNoNullMap(Array.from(transObjMap.values()), async (transObj) => transObj.onTick());
            });
        } finally {
            this.__processingTick = false;
        }
    }

    /**
     * 获取交易service
     * @param chainName
     */
    abstract getTransactionService(chainName: ChainName): ChainTransServiceBase<StateID, ChainName, Entity>;

    /**
     * 获取待处理交易的条件
     */
    abstract getPendingTransOptions(): FindOptionsWhere<Entity>;

    /**
     * 获取初始化交易的条件
     */
    abstract getInitTransOptions(): FindOptionsWhere<Entity>;

    /**
     * 设置交易为待处理
     * @param trans
     */
    abstract setTransPending(trans: Entity): void;

    /**
     * 加载交易
     */
    abstract loadTransaction(): Promise<void>;

    /**
     * 加载交易
     */
    protected async __loadTransaction(service: ChainTransServiceBase<StateID, ChainName, Entity>) {
        // 加载待处理的交易
        await this.__loadPendingTransaction(service);
        // 定期加载初始化的交易，并设置为待处理
        this.__loadInitTransaction(service);
    }

    /**
     * 加载待处理的交易
     */
    private async __loadPendingTransaction(service: ChainTransServiceBase<StateID, ChainName, Entity>) {
        const options = this.getPendingTransOptions();
        await CommonHelper.pageLoop(
            DefalutPageSize,
            async () => {
                const count = await service.repository.countBy(options);
                Logger.debug(`[${service.chainName}] processing count: ${count}`);
                return count;
            },
            async (page: number, pageSize: number) => {
                const datas = await service.repository.find({ where: options, skip: page * pageSize, take: pageSize });
                return datas;
            },
            async (trans) => {},
            async (page, pageTimeStart, transArray) => {
                await this.__createTransObjs(transArray);
                Logger.debug(`[${service.chainName}] __loadPendingTransaction. page:${page} Finish costTime:${Date.now() - pageTimeStart} ms`);
            },
            (timeStart: number) => {
                const costTime = Date.now() - timeStart;
                if (costTime > 5000) {
                    Logger.debug(`[${service.chainName}] __loadPendingTransaction costTime: ${costTime} ms`);
                }
            },
        );
    }

    /**
     * 定期加载初始化的交易，并设置为待处理
     */
    private async __loadInitTransaction(service: ChainTransServiceBase<StateID, ChainName, Entity>) {
        const options = this.getInitTransOptions();
        const __load = async () => {
            const transObjMap = this.__processingTransObjMap.get(service.chainName);
            const MAX_PENDING_COUNT = 5000;
            if (transObjMap && transObjMap.size > MAX_PENDING_COUNT) {
                Logger.debug(`[${service.chainName}] don't load init transaction because of transObjMap.size:${transObjMap.size} > ${MAX_PENDING_COUNT}`);
                return transObjMap.size - MAX_PENDING_COUNT;
            }
            const count = await service.repository.countBy(options);
            if (count === 0) {
                return;
            }
            Logger.debug(`[${service.chainName}] init count: ${count}`);
            const timeStart = Date.now();
            const transArray = await service.repository.find({ where: options, take: MAX_PENDING_COUNT });
            $noNullMap(transArray, (trans) => {
                this.setTransPending(trans);
            });
            await this.__createTransObjs(transArray);
            const costTime = Date.now() - timeStart;
            if (costTime > 5000) {
                Logger.debug(`[${service.chainName}] __loadInitTransaction costTime: ${costTime} ms`);
            }
        };
        const TICK_INTERVAL = 1000;
        const OVER_TICK_INTERVAL_UNIT = 20;
        do {
            try {
                const overCount = await __load();
                const interval = overCount ? overCount * OVER_TICK_INTERVAL_UNIT : TICK_INTERVAL;
                if (interval !== TICK_INTERVAL) {
                    Logger.debug(`[${service.chainName}] __loadInitTransaction sleep: ${interval} ms`);
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
     * @param chainName
     * @param txId
     */
    async createTransObjById(chainName: ChainName, txId: string) {
        const transactionService = this.getTransactionService(chainName);
        const trans = await transactionService.repository.findOneByForce({ entityId: txId } as FindOptionsWhere<Entity>);
        return (await this.__createTransObjs(trans))[0];
    }

    /**
     * 创建交易逻辑对象
     * @param trans
     */
    abstract newTransObj(trans: Entity): Obj;

    /**
     * 批量生成交易逻辑对象
     * @param transArray
     * @returns
     */
    protected async __createTransObjs(transArray: Entity | Entity[]) {
        if (!(transArray instanceof Array)) {
            transArray = [transArray];
        }
        const transObjs = $noNullMap(transArray, (trans) => {
            if (this.__getProcessingTrans(trans.chainName, trans.entityId)) {
                // 如果已经存在，则不new
                Logger.error(`trans already exist! [${trans.chainName}] txId:${trans.entityId}`);
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
    protected __getProcessingTrans(chainName: ChainName, txId: string) {
        const trans = this.__processingTransObjMap.get(chainName)?.get(txId);
        return trans;
    }

    /**
     * 设置处理中的交易
     * @param transObjs
     */
    private __setProcessingTrans(transObjs: Obj | Obj[]) {
        if (!(transObjs instanceof Array)) {
            transObjs = [transObjs];
        }
        transObjs.map((transObj) => {
            const setTransObj = (processingKey: string) => {
                let transObjMap = this.__processingTransObjMap.get(transObj.chainName);
                if (!transObjMap) {
                    transObjMap = new Map<string, Obj>();
                    this.__processingTransObjMap.set(transObj.chainName, transObjMap);
                }
                transObjMap.set(processingKey, transObj);
            };
            setTransObj(transObj.processingKey);
        });
    }

    /**
     * 删除处理中的交易
     * @param chainName
     * @param txIds
     */
    deleteProcessingTrans(chainName: ChainName, txIds: string | string[]) {
        const transObjMap = this.__processingTransObjMap.get(chainName);
        if (!transObjMap) {
            return;
        }
        if (!(txIds instanceof Array)) {
            txIds = [txIds];
        }
        // Logger.warn(`delete: ${txIds}`);
        txIds.map((txId) => transObjMap.delete(txId));
    }
}
