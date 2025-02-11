import { FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { OrderMgr } from "./order-mgr";
import { OrderState } from "./order-state";
import { FSMEntity, FSMObj, BaseRepository } from "@bnqkl/server-util";

/**订单的逻辑对象 */
export abstract class OrderObj<
        StateID extends number,
        State extends OrderState<StateID> = OrderState<StateID>,
        Entity extends FSMEntity<StateID> = FSMEntity<StateID>,
    >
    extends FSMObj<StateID, State, Entity>
    implements WalletServerSdk.Order.OrderObj<StateID>
{
    /**接收方转账事件重试时间戳 */
    public retryToTxStamp?: number;
    /**接收方转账事件重试次数 */
    public retryToTxNum = 0;
    /**创建发送方转账逻辑对象成功 */
    public createFromTxObjSuccess = false;

    constructor(entity: Entity, private __orderMgr: OrderMgr<StateID, State, Entity>, private __repository: BaseRepository<Entity>) {
        super(entity, __orderMgr);
    }

    get orderType() {
        return this.__orderMgr.orderType;
    }

    /**订单号 */
    get orderId() {
        return this.entityId;
    }

    /**
     * 保存
     */
    async save() {
        return await this.__repository.update({ entityId: this.orderId } as FindOptionsWhere<Entity>, {
            ...(this.entity as QueryDeepPartialEntity<Entity>),
            updatedTime: new Date(),
        });
    }

    /**
     * 保存state
     */
    async saveState() {
        return await this.__repository.update(
            { entityId: this.orderId } as FindOptionsWhere<Entity>,
            { state: this.curStateId, updatedTime: new Date() } as Partial<Entity> as QueryDeepPartialEntity<Entity>,
        );
    }

    /**
     * 关闭订单
     */
    async close() {
        // 保存
        await this.save();
        // 从处理map中删除
        this.__orderMgr.deleteProcessingOrder(this.orderId);
    }

    /**
     * 开始接收方交易上链回调
     */
    async onToTxStartCallback(): Promise<void> {
        await this.curState?.onToTxStartCallback(this as OrderObj<StateID>);
    }

    /**
     * 外链上链成功回调
     * @param trans
     */
    async onExternalChainSuccessCallback(trans: WalletTypings.ExternalChain.TransactionBase): Promise<void> {
        await this.curState?.onExternalChainSuccessCallback(this as OrderObj<StateID>, trans);
    }

    /**
     * 外链上链失败回调
     * @param trans
     */
    async onExternalChainFailCallback(trans: WalletTypings.ExternalChain.TransactionBase): Promise<void> {
        await this.curState?.onExternalChainFailCallback(this as OrderObj<StateID>, trans);
    }

    /**
     * 内链上链成功回调
     * @param trans
     */
    async onInternalChainSuccessCallback(trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        await this.curState?.onInternalChainSuccessCallback(this as OrderObj<StateID>, trans);
    }

    /**
     * 内链上链失败回调
     * @param trans
     */
    async onInternalChainFailCallback(trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        await this.curState?.onInternalChainFailCallback(this as OrderObj<StateID>, trans);
    }

    /**
     * 支付人民币成功回调
     * @param trans
     */
    async onPayRmbSuccessCallback(trans: WalletTypings.Rmb.TransactionBase): Promise<void> {
        await this.curState?.onPayRmbSuccessCallback(this as OrderObj<StateID>, trans);
    }

    /**
     * 支付人民币失败回调
     * @param trans
     */
    async onPayRmbFailCallback(trans: WalletTypings.Rmb.TransactionBase): Promise<void> {
        await this.curState?.onPayRmbFailCallback(this as OrderObj<StateID>, trans);
    }
}
