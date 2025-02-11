import { FSMState, Logger } from "@bnqkl/server-util";
import { OrderObj } from "./order-obj";

/**订单状态基类 */
export abstract class OrderState<StateID extends number> extends FSMState<StateID> implements WalletServerSdk.Order.OrderState<StateID> {
    constructor(stateId: StateID) {
        super(stateId);
    }

    /**
     * 开始接收方交易上链回调
     * @param orderObj
     */
    async onToTxStartCallback(orderObj: OrderObj<StateID>): Promise<void> {
        Logger.error(`<${orderObj.orderType}> orderId:${orderObj.orderId} can't onToTxStartCallback in state:${this.getStateName()}`);
    }

    /**
     * 外链上链成功回调
     * @param orderObj
     * @param trans
     */
    async onExternalChainSuccessCallback(orderObj: OrderObj<StateID>, trans: WalletTypings.ExternalChain.TransactionBase): Promise<void> {
        Logger.warn(
            `<${orderObj.orderType}> orderId:${orderObj.orderId} txHash:${trans.txHash} can't onExternalChainSuccessCallback in state:${this.getStateName()}`,
        );
    }

    /**
     * 外链上链失败回调
     * @param orderObj
     * @param trans
     */
    async onExternalChainFailCallback(orderObj: OrderObj<StateID>, trans: WalletTypings.ExternalChain.TransactionBase): Promise<void> {
        Logger.warn(
            `<${orderObj.orderType}> orderId:${orderObj.orderId} txHash:${trans.txHash} can't onExternalChainFailCallback in state:${this.getStateName()}`,
        );
    }

    /**
     * 内链上链成功回调
     * @param orderObj
     * @param trans
     */
    async onInternalChainSuccessCallback(orderObj: OrderObj<StateID>, trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        Logger.warn(
            `<${orderObj.orderType}> orderId:${orderObj.orderId} txId:${trans.entityId} can't onInternalChainSuccessCallback in state:${this.getStateName()}`,
        );
    }

    /**
     * 内链上链失败回调
     * @param orderObj
     * @param trans
     */
    async onInternalChainFailCallback(orderObj: OrderObj<StateID>, trans: WalletTypings.InternalChain.TransactionBase): Promise<void> {
        Logger.warn(
            `<${orderObj.orderType}> orderId:${orderObj.orderId} txId:${trans.entityId} can't onInternalChainFailCallback in state:${this.getStateName()}`,
        );
    }

    /**
     * 支付人民币成功回调
     * @param orderObj
     * @param trans
     */
    async onPayRmbSuccessCallback(orderObj: OrderObj<StateID>, trans: WalletTypings.Rmb.TransactionBase): Promise<void> {
        Logger.warn(
            `<${orderObj.orderType}> orderId:${orderObj.orderId} platformTxId:${
                trans.platformTxId
            } can't onPayRmbSuccessCallback in state:${this.getStateName()}`,
        );
    }

    /**
     * 支付人民币失败回调
     * @param orderObj
     * @param trans
     */
    async onPayRmbFailCallback(orderObj: OrderObj<StateID>, trans: WalletTypings.Rmb.TransactionBase): Promise<void> {
        Logger.warn(
            `<${orderObj.orderType}> orderId:${orderObj.orderId} platformTxId:${trans.platformTxId} can't onPayRmbFailCallback in state:${this.getStateName()}`,
        );
    }
}
