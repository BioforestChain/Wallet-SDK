import { Injectable, Inject } from "@nestjs/common";
import { RmbTransactions } from "../../common/entity.js";
import {
    ALIPAY_TRADE_STATUS,
    BaseRepository,
    CHAIN_NETWORK_TYPE,
    CommonHelper,
    Logger,
    RMB_PAY_PLATFORM,
    RMB_TRANS_STATE_ID,
    TRANS_QUEUE_ROUTING_KEY,
} from "@bnqkl/wallet-sdk";
import { DataSource, In } from "typeorm";
import { CreateRmbTransObjReqDto, GetRmbTransReqDto, NotifyAlipayReqDto, SaveRmbTransactionReqDto, UpdateRmbTransStateReqDto } from "./dto.js";
import { alipaySdk, TransHelper } from "../../helper.js";
import { BUSINESS_QUEUE_ROUTING_KEY } from "../../common.js";
import { staticConfig } from "../../config.js";
import { businessPublisher } from "../mq.js";
import { AlipaySdkCommonResult } from "alipay-sdk";

@Injectable()
export class RmbTransactionRepository extends BaseRepository<RmbTransactions> {
    constructor(dataSource: DataSource) {
        super(RmbTransactions, dataSource);
    }
}

export class RmbTransService {
    @Inject(RmbTransactionRepository)
    public readonly repository: RmbTransactionRepository;

    newTransaction() {
        return new RmbTransactions();
    }

    /**
     * 检查是否过期
     * @param trans
     */
    async checkExpire(trans: RmbTransactions): Promise<boolean> {
        return false;
    }

    /**
     * 保存人民币交易
     * @param dto
     * @returns
     */
    async saveTransaction(dto: SaveRmbTransactionReqDto): Promise<WalletTypings.Rmb.Api.SaveRmbTransactionResDto> {
        const { detail, param } = dto;
        const trans = await this.createTransaction(detail, param);
        let payPageInfo: WalletTypings.Rmb.RmbPayPageInfo = {};
        switch (detail.platform) {
            case RMB_PAY_PLATFORM.ALI_PAY:
                payPageInfo = this.__alipayAppPay(trans.entityId, trans.amount);
                break;
            default:
                break;
        }
        await this.repository.save(trans);
        return {
            txId: trans.entityId,
            payPageInfo,
        };
    }

    /**
     * 生成人民币交易逻辑对象
     * @param dto
     */
    async createTransObj(dto: CreateRmbTransObjReqDto): Promise<void> {
        const { txId } = dto;
        const updateTransResult = await this.repository.update({ entityId: txId, state: RMB_TRANS_STATE_ID.INIT }, { state: RMB_TRANS_STATE_ID.WAIT_PAY });
        if (updateTransResult.affected && updateTransResult.affected > 0) {
            await TransHelper.createRmbTransObj(txId);
        }
    }

    /**
     * 获取人民币交易
     * @param dto
     * @returns
     */
    async getTrans(dto: GetRmbTransReqDto): Promise<WalletTypings.Rmb.Api.GetRmbTransResDto> {
        const { txId } = dto;
        return await this.repository.findOneForce({ where: { entityId: txId } });
    }

    /**
     * 更新人民币交易状态
     * @param dto
     * @returns
     */
    async updateTransState(dto: UpdateRmbTransStateReqDto): Promise<WalletTypings.Rmb.Api.UpdateRmbTransStateResDto> {
        const { txId, state } = dto;
        const updateTransResult = await this.repository.update({ entityId: txId }, { state });
        return updateTransResult.affected && updateTransResult.affected > 0 ? true : false;
    }

    /**
     * 获取待支付的交易
     * @param dto
     * @returns
     */
    async getPendingTransaction(dto: { userId: string }): Promise<RmbTransactions[]> {
        const { userId } = dto;
        return await this.repository.findBy({ userId, state: In([RMB_TRANS_STATE_ID.INIT, RMB_TRANS_STATE_ID.WAIT_PAY]) });
    }

    /**
     * 创建人民币交易
     * @param detail
     * @param param
     * @returns
     */
    async createTransaction(detail: WalletTypings.Rmb.RmbTransDetail, param?: WalletTypings.Entity.BusinessParam) {
        const { platform, userId, amount } = detail;
        const trans = this.newTransaction();
        // platformTxId先用entityId保证唯一索引
        trans.platformTxId = trans.entityId;
        trans.platform = platform;
        trans.userId = userId;
        trans.amount = amount;
        trans.state = RMB_TRANS_STATE_ID.INIT;
        if (param) {
            trans.mqId = param.mqId;
            trans.linkType = param.linkType;
            trans.linkId = param.linkId;
        }
        return trans;
    }

    /**
     * 支付宝app支付接口2.0
     * @param txId
     * @param amount
     * @returns
     */
    private __alipayAppPay(txId: string, amount: string): WalletTypings.Rmb.RmbPayPageInfo {
        if (staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET) {
            return { alipayOrderStr: CommonHelper.getRandomChar(20) };
        }
        const orderStr = alipaySdk.sdkExecute("alipay.trade.app.pay", {
            notify_url: staticConfig.alipay.notifyUrl,
            biz_content: {
                out_trade_no: txId,
                product_code: "QUICK_MSECURITY_PAY",
                total_amount: amount,
                subject: "NEWCARBON",
                timeout_express: "15m",
            },
        });
        Logger.debug(`out_trade_no:${txId} orderStr:${orderStr}`);
        return { alipayOrderStr: orderStr };
    }

    /**
     * 支付宝订单异步回调通知
     * @param dto
     * @returns
     */
    async handleAlipayNotify(dto: NotifyAlipayReqDto): Promise<WalletTypings.Rmb.Api.NotifyAlipayResDto> {
        try {
            Logger.debug(`notify: ${JSON.stringify(dto, null, 2)}`);
            if (staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.MAINNET) {
                const isValid = alipaySdk.checkNotifySign(dto);
                if (!isValid) {
                    throw Error(`Invalid Alipay notification`);
                }
            }
            const { out_trade_no } = dto;
            await businessPublisher.publishAlipayNotifyEvent(BUSINESS_QUEUE_ROUTING_KEY.ALIPAY_NOTIFY, { txId: out_trade_no, notifyData: dto });
            return "success";
        } catch (error) {
            Logger.error(error);
            return "failure";
        }
    }

    /**
     * 支付宝统一收单交易查询
     * @param out_trade_no
     * @returns
     */
    async alipayTradeQuery(out_trade_no: string): Promise<AlipaySdkCommonResult> {
        if (staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET) {
            return {
                code: "10000",
                msg: "Success",
                out_trade_no,
                trade_no: CommonHelper.getUuid(),
                trade_status: ALIPAY_TRADE_STATUS.TRADE_SUCCESS,
            };
        }
        return await alipaySdk.exec("alipay.trade.query", {
            biz_content: { out_trade_no },
        });
    }
}
