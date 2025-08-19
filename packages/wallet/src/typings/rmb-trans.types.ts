import { RMB_TRANS_STATE_ID } from "@bnqkl/wallet-typings";
import { RmbTransactions } from "../common.js";

export {};
declare global {
    export namespace Wallet {
        export namespace RmbTrans {
            /**人民币交易管理器 */
            export interface TransMgr<State extends TransState = TransState, Entity extends RmbTransactions = RmbTransactions, Obj extends TransObj = TransObj>
                extends ServerUtil.FSM.FSMMgr<RMB_TRANS_STATE_ID, State>,
                    ServerUtil.Mq.MqProcessor {
                /**
                 * 获取待处理交易的条件
                 */
                getPendingTransOptions(): import("typeorm").FindOptionsWhere<Entity>;

                /**
                 * 获取初始化交易的条件
                 */
                getInitTransOptions(): import("typeorm").FindOptionsWhere<Entity>;

                /**
                 * 设置交易为待处理
                 * @param trans
                 */
                setTransPending(trans: Entity): void;

                /**
                 * 加载交易
                 */
                loadTransaction(): Promise<void>;

                /**
                 * 根据txId生成交易逻辑对象
                 *
                 * @param txId
                 */
                createTransObjById(txId: string): Promise<Obj>;

                /**
                 * 创建交易逻辑对象
                 * @param trans
                 */
                newTransObj(trans: Entity): Obj;

                /**
                 * 删除处理中的交易
                 * @param txIds
                 */
                deleteProcessingTrans(txIds: string | string[]): void;
            }

            /**人民币交易的逻辑对象 */
            export interface TransObj extends ServerUtil.FSM.FSMObj<RMB_TRANS_STATE_ID> {
                /**
                 * 保存
                 */
                save(): Promise<void>;

                /**
                 * 保存state
                 */
                saveState(): Promise<void>;

                /**
                 * 支付成功回调
                 * @param platformTxId
                 */
                onPaySuccessCallback(platformTxId: string): Promise<void>;

                /**
                 * 支付失败回调
                 * @param platformTxId
                 * @param errMsg
                 */
                onPayFailCallback(platformTxId: string, errMsg: string): Promise<void>;
            }

            /**人民币交易状态 */
            export interface TransState extends ServerUtil.FSM.FSMState<RMB_TRANS_STATE_ID> {
                /**
                 * 支付成功回调
                 * @param transObj
                 * @param platformTxId
                 */
                onPaySuccessCallback(transObj: TransObj, platformTxId: string): Promise<void>;

                /**
                 * 支付失败回调
                 * @param transObj
                 * @param platformTxId
                 * @param errMsg
                 */
                onPayFailCallback(transObj: TransObj, platformTxId: string, errMsg: string): Promise<void>;
            }
        }
    }
}
