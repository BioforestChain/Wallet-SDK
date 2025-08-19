import { AIRDROP_ORDER_STATE_ID, Logger } from "@bnqkl/wallet-sdk";
import { forwardRef, Inject } from "@nestjs/common";
import { AirdropService } from "../../airdrop.service.js";
import { OrderState } from "@bnqkl/wallet-sdk";
import type { AirdropOrderObj } from "../airdrop-order-obj.js";

/**空投订单状态基类 */
export abstract class AirdropOrderState extends OrderState<AIRDROP_ORDER_STATE_ID> implements Wallet.Airdrop.OrderState {
    @Inject(forwardRef(() => AirdropService))
    protected __airdropService!: AirdropService;

    constructor(stateId: AIRDROP_ORDER_STATE_ID) {
        super(stateId);
    }

    getStateName() {
        return AIRDROP_ORDER_STATE_ID[this.getStateId()];
    }

    /**
     * 开始发行交易上链回调
     * @param orderObj
     */
    async onIssueTxStartCallback(orderObj: AirdropOrderObj): Promise<void> {
        Logger.error(`<${orderObj.orderType}> orderId:${orderObj.orderId} can't onIssueTxStartCallback in state:${this.getStateName()}`);
    }

    /**
     * 进入转移状态回调
     * @param orderObj
     */
    async onEnterTransferStateCallback(orderObj: AirdropOrderObj): Promise<void> {
        Logger.error(`<${orderObj.orderType}> orderId:${orderObj.orderId} can't onEnterTransferStateCallback in state:${this.getStateName()}`);
    }

    /**
     * 开始转移交易上链回调
     * @param orderObj
     * @param txId
     */
    async onTransferTxStartCallback(orderObj: AirdropOrderObj, txId: string): Promise<void> {
        Logger.error(`<${orderObj.orderType}> orderId:${orderObj.orderId} txId:${txId} can't onTransferTxStartCallback in state:${this.getStateName()}`);
    }
}
