import { ExternalTransStateID } from "@bnqkl/wallet-sdk";

export {};
declare global {
    export namespace Wallet {
        /**ExternalChain事件 */
        export type ExternalChainApiEvents = {
            /**链上出新块 */
            onNewBlock: { in: number; out: void };
        };

        export namespace ExternalChain {
            /**外链交易的逻辑对象 */
            export interface TransObj extends ChainTrans.TransObj<ExternalTransStateID> {
                /**
                 * 上链失败回调
                 * @param errMsg
                 */
                onChainFailCallback(errMsg: string): Promise<void>;
            }

            /**外链交易状态 */
            export interface TransState extends ChainTrans.TransState<ExternalTransStateID> {
                /**
                 * 上链失败回调
                 * @param transObj
                 * @param errMsg
                 */
                onChainFailCallback(transObj: TransObj, errMsg: string): Promise<void>;
            }
        }
    }
}
