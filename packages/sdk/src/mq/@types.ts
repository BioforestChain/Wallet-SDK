export {};
declare global {
    export namespace WalletServerSdk {
        export namespace Mq {
            /**消费上链事件数据 */
            export interface ConsumeOnChainEventData {
                chainName: string;
                entityId: string;
            }
            /**消费支付人民币事件数据 */
            export interface ConsumeRmbPayEventData {
                entityId: string;
                params?: {
                    /**转移dp的txid */
                    transferDpTxId: string;
                };
            }

            /**消费订单事件数据 */
            export interface ConsumeOrderEventData extends ServerUtil.Mq.ConsumeOrderEventData {
                params?: {
                    /**转移dp的txid */
                    transferDpTxId: string;
                };
            }
        }
    }
}
