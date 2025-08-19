import type { RMB_TRANS_STATE_ID } from "@bnqkl/wallet-typings";
import { ALIPAY_TRADE_STATUS, RMB_PAY_PLATFORM } from "@bnqkl/wallet-typings";
import { Injectable } from "@nestjs/common";
import type { RmbTransactions } from "../../common/entity/index.js";
import type { RmbTransMgr } from "./rmb-trans-mgr.js";
import type { RmbTransState } from "./state/index.js";
import type { RmbTransService } from "./rmb-trans.service.js";
import { CHAIN_NETWORK_TYPE, FSMObj } from "@bnqkl/wallet-sdk";
import { staticConfig } from "../../config/index.js";

/**人民币交易的逻辑对象 */
@Injectable()
export class RmbTransObj extends FSMObj<RMB_TRANS_STATE_ID, RmbTransState, RmbTransactions> implements Wallet.RmbTrans.TransObj {
    /**人民币订单查询重试计时器id */
    private __retryRmbQueryTimeId?: NodeJS.Timeout;

    constructor(trans: RmbTransactions, private __rmbTransMgr: RmbTransMgr, private __rmbTransService: RmbTransService) {
        super(trans, __rmbTransMgr);
    }

    /**唯一id */
    get txId() {
        return this.entity.entityId;
    }

    /**支付平台交易id */
    get platformTxId() {
        return this.entity.platformTxId;
    }
    set platformTxId(id: string) {
        this.entity.platformTxId = id;
    }

    /**支付平台 */
    get platform() {
        return this.entity.platform;
    }

    /**支付平台名字 */
    get platformName() {
        return RMB_PAY_PLATFORM[this.entity.platform];
    }

    /**消息队列id */
    get mqId() {
        return this.entity.mqId;
    }

    /**关联业务表编号 */
    get linkId() {
        return this.entity.linkId;
    }

    /** 失败原因 */
    get failReason() {
        return this.entity.failReason;
    }
    set failReason(failReason: string | undefined) {
        this.entity.failReason = failReason;
    }

    /**
     * 重试人民币订单查询
     */
    async retryRmbQuery() {
        /**人民币查询订单结果重试间隔 */
        const RMB_QUERY_RETRY_INVERVAL = staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET ? 5000 : 30 * 1000;
        this.__retryRmbQueryTimeId = setTimeout(async () => {
            switch (this.platform) {
                case RMB_PAY_PLATFORM.ALI_PAY:
                    // 支付宝订单未收到通知，查询订单结果
                    const notifyData = await this.__rmbTransService.alipayTradeQuery(this.txId);
                    await this.processAlipayNotifyData(notifyData as unknown as WalletTypings.Rmb.Api.NotifyAlipayReqDto);
                    break;
                default:
                    break;
            }
        }, RMB_QUERY_RETRY_INVERVAL);
    }

    /**中止人民币订单查询重试计时器 */
    clearRetryAlipayQueryTimeout() {
        if (this.__retryRmbQueryTimeId) {
            clearTimeout(this.__retryRmbQueryTimeId);
            this.__retryRmbQueryTimeId = undefined;
        }
    }

    /**
     * 处理支付宝订单通知数据
     * @param notifyData
     */
    async processAlipayNotifyData(notifyData: WalletTypings.Rmb.Api.NotifyAlipayReqDto) {
        const { trade_status, trade_no } = notifyData;
        switch (trade_status) {
            case ALIPAY_TRADE_STATUS.TRADE_SUCCESS:
            case ALIPAY_TRADE_STATUS.TRADE_FINISHED:
                await this.onPaySuccessCallback(trade_no);
                break;
            case ALIPAY_TRADE_STATUS.TRADE_CLOSED:
                await this.onPayFailCallback(trade_no, "未付款交易超时关闭");
                break;
            default:
                throw Error(`trade_status:${trade_status} is error`);
        }
    }

    /**
     * 保存
     */
    async save() {
        await this.__rmbTransService.repository.update({ entityId: this.txId }, { ...this.entity, updatedTime: new Date() });
    }

    /**
     * 保存state
     */
    async saveState() {
        await this.__rmbTransService.repository.update({ entityId: this.txId }, { state: this.curStateId, updatedTime: new Date() });
    }

    /**
     * 关闭交易
     */
    async close() {
        // 保存
        await this.save();
        // 从处理map中删除
        this.__rmbTransMgr.deleteProcessingTrans(this.txId);
    }

    /**
     * 支付成功回调
     * @param platformTxId
     */
    async onPaySuccessCallback(platformTxId: string): Promise<void> {
        await this.curState?.onPaySuccessCallback(this, platformTxId);
    }

    /**
     * 支付失败回调
     * @param platformTxId
     * @param errMsg
     */
    async onPayFailCallback(platformTxId: string, errMsg: string) {
        await this.curState?.onPayFailCallback(this, platformTxId, errMsg);
    }
}
