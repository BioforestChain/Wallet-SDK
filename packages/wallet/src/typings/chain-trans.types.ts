import { ChainTransEntity, ChainTransServiceBase } from "../common.js";

export {};
declare global {
    export namespace Wallet {
        export namespace ChainTrans {
            /**链上交易管理器 */
            export interface TransMgr<
                StateID extends number,
                ChainName extends string,
                State extends TransState<StateID> = TransState<StateID>,
                Entity extends ChainTransEntity<StateID, ChainName> = ChainTransEntity<StateID, ChainName>,
                Obj extends TransObj<StateID> = TransObj<StateID>,
            > extends ServerUtil.FSM.FSMMgr<StateID, State>,
                    ServerUtil.Mq.MqProcessor {
                /**
                 * 获取交易service
                 * @param chainName
                 */
                getTransactionService(chainName: ChainName): ChainTransServiceBase<StateID, ChainName, Entity>;

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
                 * @param chainName
                 * @param txId
                 */
                createTransObjById(chainName: ChainName, txId: string): Promise<Obj>;

                /**
                 * 创建交易逻辑对象
                 * @param trans
                 */
                newTransObj(trans: Entity): Obj;

                /**
                 * 删除处理中的交易
                 * @param chainName
                 * @param txIds
                 */
                deleteProcessingTrans(chainName: ChainName, txIds: string | string[]): void;
            }

            /**交易的逻辑对象 */
            export interface TransObj<TransStateID extends number> extends ServerUtil.FSM.FSMObj<TransStateID> {
                /**
                 * 保存
                 */
                save(): Promise<void>;

                /**
                 * 保存state
                 */
                saveState(): Promise<void>;

                /**
                 * 开始上链回调
                 */
                onChainStartCallback(): Promise<void>;

                /**
                 * 广播成功回调
                 * @param txHash
                 */
                onBroadcastSuccessCallback(txHash: string): Promise<void>;

                /**
                 * 上链成功回调
                 * @param height
                 * @param txHash
                 */
                onChainSuccessCallback(height: number, txHash: string): Promise<void>;
            }

            /**交易状态 */
            export interface TransState<TransStateID extends number> extends ServerUtil.FSM.FSMState<TransStateID> {
                /**
                 * 开始上链回调
                 * @param transObj
                 */
                onChainStartCallback(transObj: TransObj<TransStateID>): Promise<void>;

                /**
                 * 广播成功回调
                 * @param transObj
                 * @param txHash
                 */
                onBroadcastSuccessCallback(transObj: TransObj<TransStateID>, txHash: string): Promise<void>;

                /**
                 * 上链成功回调
                 * @param transObj
                 * @param height
                 * @param txHash
                 */
                onChainSuccessCallback(transObj: TransObj<TransStateID>, height: number, txHash: string): Promise<void>;
            }
        }
    }
}
