import { ALIPAY_TRADE_STATUS, RMB_PAY_PLATFORM, RMB_TRANS_STATE_ID } from "./constants.js";

export {};
declare global {
    export namespace WalletTypings {
        export namespace Rmb {
            export namespace Api {
                /**
                 * 保存人民币交易
                 * POST /wallet/rmb/saveTransaction
                 * WALLET_RMB_API_REQUEST.SAVE_TRANSACTION
                 */
                export interface SaveRmbTransactionReqDto {
                    /**人民币交易详情 */
                    detail: RmbTransDetail;
                    /**业务参数 */
                    param?: Entity.BusinessParam;
                }
                export interface SaveRmbTransactionResDto {
                    /**交易id */
                    txId: string;
                    /**付款页面信息 */
                    payPageInfo: RmbPayPageInfo;
                }

                /**
                 * 生成人民币交易逻辑对象
                 * POST /wallet/rmb/createTransObj
                 * WALLET_RMB_API_REQUEST.CREATE_TRANS_OBJ
                 */
                export interface CreateRmbTransObjReqDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 获取人民币交易
                 * GET /wallet/rmb/getTrans
                 * WALLET_RMB_API_REQUEST.GET_TRANS
                 */
                export interface GetRmbTransReqDto {
                    /**交易id */
                    txId: string;
                }
                export type GetRmbTransResDto = TransactionBase;

                /**
                 * 更新人民币交易状态
                 * POST /wallet/rmb/updateTransState
                 * WALLET_RMB_API_REQUEST.UPDATE_TRANS_STATE
                 */
                export interface UpdateRmbTransStateReqDto {
                    /**交易id */
                    txId: string;
                    /**交易状态 */
                    state: RMB_TRANS_STATE_ID;
                }
                export type UpdateRmbTransStateResDto = boolean;

                /**
                 * 支付宝订单异步回调通知
                 * POST /wallet/rmb/alipay/notify
                 * WALLET_RMB_API_REQUEST.ALI_PAY_NOTIFY
                 */
                export interface NotifyAlipayReqDto {
                    /**外部交易id */
                    out_trade_no: string;
                    /**支付宝交易id */
                    trade_no: string;
                    /**交易状态 */
                    trade_status: ALIPAY_TRADE_STATUS;
                }
                export type NotifyAlipayResDto = string;
            }

            export interface TransactionBase extends Entity.FSMEntity<RMB_TRANS_STATE_ID> {
                /**支付平台交易id */
                platformTxId: string;
                /**支付平台 */
                platform: RMB_PAY_PLATFORM;
                /**用户id */
                userId: string;
                /**交易金额 */
                amount: string;
                /**失败原因 */
                failReason?: string;
                /**消息队列id */
                mqId?: string;
                /**关联业务表类型 */
                linkType?: number;
                /**关联业务表编号 */
                linkId?: string;
            }

            /**人民币交易详情 */
            export interface RmbTransDetail {
                /**支付平台 */
                platform: RMB_PAY_PLATFORM;
                /**用户id */
                userId: string;
                /**交易金额 */
                amount: string;
            }

            /**付款页面信息 */
            export interface RmbPayPageInfo {
                /**支付宝付款页面信息 */
                alipayOrderStr?: string;
            }
        }
    }
}
