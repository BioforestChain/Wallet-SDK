export {};
declare global {
    export namespace Wallet {
        export namespace Mq {
            /**消费支付宝交易通知数据 */
            export type ConsumeAlipayNotifyEventData = {
                /**rmb交易id */
                txId: string;
                /**通知数据 */
                notifyData: WalletTypings.Rmb.Api.NotifyAlipayReqDto;
            };
        }
    }
}
