import { Inject, OnModuleInit, forwardRef } from "@nestjs/common";
import { CMD } from "../../common";
import { BaseApp } from "../app";
import { ipcHelpers } from "../../helper";
import { ExternalChainTransMgr } from "../../module/external-chain-trans/external-chain-trans-mgr";
import { InternalChainTransMgr } from "../../module/internal-chain-trans/internal-chain-trans-mgr";
import { RmbTransMgr } from "../../module/rmb-trans/rmb-trans-mgr";

export class TransApp extends BaseApp implements OnModuleInit {
    @Inject(forwardRef(() => ExternalChainTransMgr))
    private __externalChainTransMgr!: ExternalChainTransMgr;
    @Inject(forwardRef(() => InternalChainTransMgr))
    private __internalChainTransMgr!: InternalChainTransMgr;
    @Inject(forwardRef(() => RmbTransMgr))
    private __rmbTransMgr!: RmbTransMgr;

    async onModuleInit() {
        await this.start();
        // 处理mq任务
        await this.__processMqTask();
        // transMgr初始化
        await this.__transMgrInit();
    }

    /**
     * 处理mq任务
     */
    private async __processMqTask() {
        this.__externalChainTransMgr.processMqTask();
        this.__internalChainTransMgr.processMqTask();
        this.__rmbTransMgr.processMqTask();
    }

    /**
     * transMgr初始化
     */
    async __transMgrInit() {
        await this.__externalChainTransMgr.init();
        await this.__internalChainTransMgr.init();
        await this.__rmbTransMgr.init();
        // mq要等init后再连接
        await this.connectMq();
    }

    async initIpc() {
        const server = await super.initIpc();
        /**注册函数 */
        ipcHelpers.register(server!, CMD.CREATE_INTERNAL_TRANS_OBJ, async (header, { chainName, txId }) => {
            await this.__internalChainTransMgr.createTransObjById(chainName, txId);
            return true;
        });
        ipcHelpers.register(server!, CMD.CREATE_EXTERNAL_TRANS_OBJ, async (header, { chainName, txId }) => {
            await this.__externalChainTransMgr.createTransObjById(chainName, txId);
            return true;
        });
        ipcHelpers.register(server!, CMD.CREATE_RMB_TRANS_OBJ, async (header, { txId }) => {
            await this.__rmbTransMgr.createTransObjById(txId);
            return true;
        });
        return server;
    }
}
