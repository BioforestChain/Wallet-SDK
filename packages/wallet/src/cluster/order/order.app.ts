import { AIRDROP_TYPE, CHAIN_NETWORK_TYPE, InternalChainName, Logger, rabbitMQCore, sleep, TRANS_QUEUE_ROUTING_KEY } from "@bnqkl/wallet-sdk";
import { forwardRef, Inject, OnModuleInit } from "@nestjs/common";
import { CMD, LOCAL_MQ_ID, TRANSACTION_LINK_TYPE } from "../../common";
import { ipcHelpers } from "../../helper";
import { MemoryService } from "../../module/memory/memory.service";
import { GlobalValueRedisRepository } from "../../module/redis";
import { BaseApp } from "../app";
import { AirdropOrderMgr } from "../../module/airdrop/order/airdrop-order-mgr";
import { InternalChainTransMgr } from "../../module/internal-chain-trans/internal-chain-trans-mgr";
import { walletConsumer } from "../../module/mq";
import { staticConfig } from "../../config";
import { NotifyService } from "../../module/notify/notify.service";

export class OrderApp extends BaseApp implements OnModuleInit {
    @Inject(forwardRef(() => MemoryService))
    private __memoryService!: MemoryService;
    @Inject(forwardRef(() => AirdropOrderMgr))
    private __airdropOrderMgr!: AirdropOrderMgr;
    @Inject(forwardRef(() => GlobalValueRedisRepository))
    private __globalValueRedisRepository!: GlobalValueRedisRepository;
    @Inject(forwardRef(() => InternalChainTransMgr))
    private __internalChainTransMgr!: InternalChainTransMgr;
    @Inject(forwardRef(() => NotifyService))
    private __notifyService!: NotifyService;

    async onModuleInit() {
        await this.start();
        /**初始化私钥 */
        await this.__injectAddress();
        // 处理mq任务
        await this.__processMqTask();
        // orderMgr初始化
        await this.__orderMgrInit();
        this.__notifyService.beginCheckOnChain();
        this.__notifyService.beginCheckNotify();
    }

    private async __injectAddress() {
        if (staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET) {
            /**开发的时候空投固定账户即可。换一个私钥，以免被其他项目混用 */
            await this.__globalValueRedisRepository.getAirdropAccount(AIRDROP_TYPE.NORMAL, "airdrop_test");
            await this.__globalValueRedisRepository.getAirdropAccount(AIRDROP_TYPE.LIMITED, "airdrop_test");
        }
    }

    /**
     * 处理mq任务
     */
    private async __processMqTask() {
        this.__airdropOrderMgr.processMqTask();
        rabbitMQCore.on("connect", () => {
            // 处理内链上链
            this.__processInternalOnChain();
        });
    }

    /**
     * 处理内链上链
     */
    private __processInternalOnChain(): void {
        const __onInternalChainCallback = async (status: boolean, trans: WalletTypings.InternalChain.TransactionBase) => {
            switch (trans.linkType) {
                case TRANSACTION_LINK_TYPE.AIRDROP_ORDER:
                    await this.__airdropOrderMgr.onInternalChainCallback(status, trans);
                    break;
                default:
                    break;
            }
        };
        // 处理内链上链成功
        walletConsumer.consumeOnChainEvent(
            TRANS_QUEUE_ROUTING_KEY.INTERNAL_SUCCESS,
            async ({ chainName, entityId }) => {
                const transactionService = this.__internalChainTransMgr.getTransactionService(chainName as InternalChainName);
                const trans = await transactionService.repository.findOneForce({ where: { entityId } });
                await __onInternalChainCallback(true, trans);
            },
            LOCAL_MQ_ID,
        );
        // 处理内链上链失败
        walletConsumer.consumeOnChainEvent(
            TRANS_QUEUE_ROUTING_KEY.INTERNAL_FAIL,
            async ({ chainName, entityId }) => {
                const transactionService = this.__internalChainTransMgr.getTransactionService(chainName as InternalChainName);
                const trans = await transactionService.repository.findOneForce({ where: { entityId } });
                await __onInternalChainCallback(false, trans);
            },
            LOCAL_MQ_ID,
        );
    }

    /**
     * orderMgr初始化
     */
    async __orderMgrInit() {
        await this.__airdropOrderMgr.init();
        // mq要等init后再连接
        await this.connectMq();
        // 检查mq内链上链相关队列是否初始化完毕
        this.checkInternalOnChainQueueInited();
    }

    /**
     * 检查mq内链上链相关队列是否初始化完毕
     */
    async checkInternalOnChainQueueInited() {
        while (true) {
            try {
                const successQueue = await walletConsumer.checkOnChainEventQueue(TRANS_QUEUE_ROUTING_KEY.INTERNAL_SUCCESS, LOCAL_MQ_ID);
                const failQueue = await walletConsumer.checkOnChainEventQueue(TRANS_QUEUE_ROUTING_KEY.INTERNAL_FAIL, LOCAL_MQ_ID);
                Logger.debug(`successQueue:${successQueue.messageCount} failQueue:${failQueue.messageCount}`);
                if (successQueue.messageCount === 0 && failQueue.messageCount === 0) {
                    break;
                }
            } catch (err) {
                Logger.error(err);
            }
            await sleep(1000);
        }
        this.__memoryService.setInternalOnChainQueueInited();
        Logger.info("internalOnChainQueueInited!");
    }

    async initIpc() {
        const server = await super.initIpc();
        ipcHelpers.register(server!, CMD.CREATE_AIRDROP_ORDER_OBJ, async (header, { orderId }) => {
            await this.__airdropOrderMgr.createOrderObjById(orderId);
            return true;
        });
        return server;
    }
}
