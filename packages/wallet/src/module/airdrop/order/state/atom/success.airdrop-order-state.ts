import { Injectable } from "@nestjs/common";
import { AIRDROP_ORDER_STATE_ID, AIRDROP_TYPE, COMMON_ORDER_QUEUE_ROUTING_KEY, Logger } from "@bnqkl/wallet-sdk";
import { AirdropOrderObj } from "../../airdrop-order-obj";
import { AirdropOrderFinallyState } from "../airdrop-order-finally.state";
import { walletPublisher } from "../../../../mq";

/**成功状态 */
@Injectable()
export class Success_AirdropOrderState extends AirdropOrderFinallyState {
    constructor() {
        super(AIRDROP_ORDER_STATE_ID.SUCCESS);
    }

    /**
     * 进入状态
     * @param orderObj
     */
    async onEnterState(orderObj: AirdropOrderObj): Promise<void> {
        const { orderType, airdropType, type, orderId, chainName, mqId } = orderObj;
        let successMsg = "";
        if (type === AIRDROP_TYPE.NORMAL) {
            successMsg = `address:${orderObj.entity.transferAddress}`;
        } else if (type === AIRDROP_TYPE.LIMITED) {
            const transferTxArray = await orderObj.getAllTransferTx();
            successMsg = `${transferTxArray.map((v) => `address:${v.address} dpNo:${v.dpNo}`)}`;
        }
        Logger.debug(`<${orderType}> airdropType:${airdropType} orderId:${orderId} 在${chainName}链上，空投给 ${successMsg} 成功！`);
        await walletPublisher.publishCommonOrderEvent(COMMON_ORDER_QUEUE_ROUTING_KEY.AIRDROP_ORDER_SUCCESS, { orderId }, mqId);
    }
}
