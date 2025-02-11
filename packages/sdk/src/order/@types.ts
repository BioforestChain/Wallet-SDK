import { FSMEntity } from "@bnqkl/server-util";
import { FindOptionsWhere, UpdateResult } from "typeorm";

export {};
declare global {
    export namespace WalletServerSdk {
        export namespace Order {
            /**订单管理器 */
            export interface OrderMgr<
                StateID extends number,
                State extends OrderState<StateID> = OrderState<StateID>,
                Entity extends FSMEntity<StateID> = FSMEntity<StateID>,
                Obj extends OrderObj<StateID> = OrderObj<StateID>,
            > extends ServerUtil.FSM.FSMMgr<StateID, State>,
                    ServerUtil.Mq.MqProcessor {
                /**
                 * 获取待处理订单的条件
                 */
                getPendingOrderOptions(): FindOptionsWhere<Entity>;

                /**
                 * 获取初始化订单的条件
                 */
                getInitOrderOptions(): FindOptionsWhere<Entity>;

                /**
                 * 设置订单为待处理
                 * @param order
                 */
                setOrderPending(order: Entity): void;

                /**
                 * 加载订单
                 */
                loadOrder(): Promise<void>;

                /**
                 * 创建订单逻辑对象
                 * @param order
                 */
                newOrderObj(order: Entity): Obj;

                /**
                 * 根据订单id生成订单逻辑对象
                 * @param orderId
                 */
                createOrderObjById(orderId: string): Promise<Obj>;

                /**
                 * 删除处理中的订单
                 * @param orderIds
                 */
                deleteProcessingOrder(orderIds: string | string[]): void;

                /**
                 * 外链上链回调
                 * @param success
                 * @param trans
                 */
                onExternalChainCallback(success: boolean, trans: WalletTypings.ExternalChain.TransactionBase): Promise<void>;

                /**
                 * 内链上链回调
                 * @param success
                 * @param trans
                 */
                onInternalChainCallback(success: boolean, trans: WalletTypings.InternalChain.TransactionBase): Promise<void>;

                /**
                 * 支付人民币回调
                 * @param success
                 * @param trans
                 */
                onPayRmbCallback(success: boolean, trans: WalletTypings.Rmb.TransactionBase): Promise<void>;

                /**
                 * 处理订单完成逻辑
                 */
                processOrderDone(): void;
            }

            /**订单的逻辑对象 */
            export interface OrderObj<OrderStateID extends number> extends ServerUtil.FSM.FSMObj<OrderStateID> {
                /**
                 * 保存
                 */
                save(): Promise<UpdateResult>;

                /**
                 * 保存state
                 */
                saveState(): Promise<UpdateResult>;

                /**
                 * 开始接收方交易上链回调
                 *
                 */
                onToTxStartCallback(): Promise<void>;

                /**
                 * 外链上链成功回调
                 * @param trans
                 */
                onExternalChainSuccessCallback(trans: WalletTypings.ExternalChain.TransactionBase): Promise<void>;

                /**
                 * 外链上链失败回调
                 * @param trans
                 */
                onExternalChainFailCallback(trans: WalletTypings.ExternalChain.TransactionBase): Promise<void>;

                /**
                 * 内链上链成功回调
                 * @param trans
                 */
                onInternalChainSuccessCallback(trans: WalletTypings.InternalChain.TransactionBase): Promise<void>;

                /**
                 * 内链上链失败回调
                 * @param trans
                 */
                onInternalChainFailCallback(trans: WalletTypings.InternalChain.TransactionBase): Promise<void>;

                /**
                 * 支付人民币成功回调
                 * @param trans
                 */
                onPayRmbSuccessCallback(trans: WalletTypings.Rmb.TransactionBase): Promise<void>;

                /**
                 * 支付人民币失败回调
                 * @param trans
                 */
                onPayRmbFailCallback(trans: WalletTypings.Rmb.TransactionBase): Promise<void>;
            }

            /**订单状态 */
            export interface OrderState<OrderStateID extends number> extends ServerUtil.FSM.FSMState<OrderStateID> {
                /**
                 * 开始接收方交易上链回调
                 * @param orderObj
                 */
                onToTxStartCallback(orderObj: OrderObj<OrderStateID>): Promise<void>;

                /**
                 * 外链上链成功回调
                 * @param orderObj
                 * @param trans
                 */
                onExternalChainSuccessCallback(orderObj: OrderObj<OrderStateID>, trans: WalletTypings.ExternalChain.TransactionBase): Promise<void>;

                /**
                 * 外链上链失败回调
                 * @param orderObj
                 * @param trans
                 */
                onExternalChainFailCallback(orderObj: OrderObj<OrderStateID>, trans: WalletTypings.ExternalChain.TransactionBase): Promise<void>;

                /**
                 * 内链上链成功回调
                 * @param orderObj
                 * @param trans
                 */
                onInternalChainSuccessCallback(orderObj: OrderObj<OrderStateID>, trans: WalletTypings.InternalChain.TransactionBase): Promise<void>;

                /**
                 * 内链上链失败回调
                 * @param orderObj
                 * @param trans
                 */
                onInternalChainFailCallback(orderObj: OrderObj<OrderStateID>, trans: WalletTypings.InternalChain.TransactionBase): Promise<void>;

                /**
                 * 支付人民币成功回调
                 * @param orderObj
                 * @param trans
                 */
                onPayRmbSuccessCallback(orderObj: OrderObj<OrderStateID>, trans: WalletTypings.Rmb.TransactionBase): Promise<void>;

                /**
                 * 支付人民币失败回调
                 * @param orderObj
                 * @param trans
                 */
                onPayRmbFailCallback(orderObj: OrderObj<OrderStateID>, trans: WalletTypings.Rmb.TransactionBase): Promise<void>;
            }
        }
    }
}
