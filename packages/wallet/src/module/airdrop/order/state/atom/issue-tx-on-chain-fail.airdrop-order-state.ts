import { Injectable } from "@nestjs/common";
import { AIRDROP_ORDER_STATE_ID, COMMON_ORDER_QUEUE_ROUTING_KEY, Logger } from "@bnqkl/wallet-sdk";
import { AirdropOrderObj } from "../../airdrop-order-obj";
import { AirdropOrderFinallyState } from "../airdrop-order-finally.state";
import { walletPublisher } from "../../../../mq";

/**发行交易上链失败状态 */
@Injectable()
export class IssueTxOnChainFail_AirdropOrderState extends AirdropOrderFinallyState {
    constructor() {
        super(AIRDROP_ORDER_STATE_ID.ISSUE_TX_ON_CHAIN_FAIL);
    }

    /**
     * 进入状态
     * @param orderObj
     */
    async onEnterState(orderObj: AirdropOrderObj): Promise<void> {
        const { orderType, airdropType, orderId, chainName, mqId } = orderObj;
        Logger.debug(`<${orderType}> airdropType:${airdropType} orderId:${orderId} 在${chainName}链上，发行dp失败`);
        await walletPublisher.publishCommonOrderEvent(COMMON_ORDER_QUEUE_ROUTING_KEY.AIRDROP_ORDER_FAIL, { orderId }, mqId);
    }
}
