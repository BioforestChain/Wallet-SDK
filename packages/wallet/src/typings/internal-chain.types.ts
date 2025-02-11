import { InternalTransStateID } from "@bnqkl/wallet-sdk";

export {};

declare global {
    export namespace Wallet {
        //链上信息文件内容
        export type ChainFile = {
            //最新区块高度
            lastBlockHeight?: number;
        };

        /**InternalChain事件 */
        export type InternalChainApiEvents = {
            /**链上出新块 */
            onNewBlock: { in: number; out: void };
        };

        /**InternalChainTransMgr事件 */
        export type InternalChainTransMgrEvents = {
            /**Bfm链上出新块 */
            onBfmNewBlock: { in: number; out: void };
            /**CCC链上出新块 */
            onCCCNewBlock: { in: number; out: void };
            /**Pmchain链上出新块 */
            onPmchainNewBlock: { in: number; out: void };
            /**ethmeta链上出新块 */
            onEthmetaNewBlock: { in: number; out: void };
            /**bfchainv2链上出新块 */
            onBFChainV2NewBlock: { in: number; out: void };
            /**btcmeta链上出新块 */
            onBTCMetaNewBlock: { in: number; out: void };
            /**btgmeta链上出新块 */
            onBTGMetaNewBlock: { in: number; out: void };
            /**biwmeta链上出新块 */
            onBIWMetaNewBlock: { in: number; out: void };
        };

        export namespace InternalChain {
            /**内链交易的逻辑对象 */
            export interface TransObj extends ChainTrans.TransObj<InternalTransStateID> {
                /**
                 * 上链失败回调
                 * @param height
                 * @param signature
                 * @param broadcastResult
                 */
                onChainFailCallback(height: number, signature: string, broadcastResult: BFMetaNodeSDK.ApiFailureReturn): Promise<void>;

                /**
                 * 同步到某个高度的回调
                 * @param height
                 */
                onHeightCallback(height: number): Promise<void>;
            }

            /**内链交易状态 */
            export interface TransState extends ChainTrans.TransState<InternalTransStateID> {
                /**
                 * 上链失败回调
                 * @param transObj
                 * @param height
                 * @param signature
                 * @param broadcastResult
                 */
                onChainFailCallback(transObj: TransObj, height: number, signature: string, broadcastResult: BFMetaNodeSDK.ApiFailureReturn): Promise<void>;

                /**
                 * 同步到某个高度的回调
                 * @param transObj
                 * @param height
                 */
                onHeightCallback(transObj: TransObj, height: number): Promise<void>;
            }

            export type SimpleGenesisAssetInfo = {
                /**区块间隔 */
                forgeInterval: number;
                /**magic */
                magic: string;
                /**创世时间 */
                beginEpochTime: number;
            };
        }
    }
}
