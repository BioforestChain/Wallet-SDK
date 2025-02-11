import { AIRDROP_ORDER_STATE_ID } from "@bnqkl/wallet-sdk";

export {};
declare global {
    export namespace Wallet {
        export namespace Airdrop {
            /**空投订单的逻辑对象 */
            export interface OrderObj extends WalletServerSdk.Order.OrderObj<AIRDROP_ORDER_STATE_ID> {
                /**
                 * 开始发行交易上链回调
                 */
                onIssueTxStartCallback(): Promise<void>;

                /**
                 * 进入转移状态回调
                 */
                onEnterTransferStateCallback(): Promise<void>;

                /**
                 * 开始转移交易上链回调
                 * @param txId
                 */
                onTransferTxStartCallback(txId: string): Promise<void>;
            }

            /**空投订单状态 */
            export interface OrderState extends WalletServerSdk.Order.OrderState<AIRDROP_ORDER_STATE_ID> {
                /**
                 * 开始发行交易上链回调
                 * @param orderObj
                 */
                onIssueTxStartCallback(orderObj: OrderObj): Promise<void>;

                /**
                 * 进入转移状态回调
                 * @param orderObj
                 */
                onEnterTransferStateCallback(orderObj: OrderObj): Promise<void>;

                /**
                 * 开始转移交易上链回调
                 * @param orderObj
                 * @param txId
                 */
                onTransferTxStartCallback(orderObj: OrderObj, txId: string): Promise<void>;
            }

            /**空投平台账户 */
            export type AirdropAccount = {
                /**空投类型 */
                type: string;
                /**私钥 */
                secret: string;
                /**地址 */
                address: string;
            };

            /**空投待处理转移交易对象 */
            export interface AirdropPendingTransferTxObj {
                /**dp转移地址 */
                transferAddress: string;
                /**dp编号 */
                dpNo: number;
                /**空投转移交易id */
                transferTxId: string;
                /**转移事件重试时间戳 */
                retryTransferTxStamp?: number;
                /**转移事件重试次数 */
                retryTransferTxNum: number;
            }
        }
    }
}
