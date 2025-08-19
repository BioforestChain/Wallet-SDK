import { AIRDROP_ORDER_STATE_ID, AIRDROP_RECORD_STATE, AIRDROP_TYPE, Logger } from "@bnqkl/wallet-sdk";
import { CMD, WORKER } from "../common/index.js";
import { ipcHelpers } from "./ipc.helper.js";

export class OrderHelper {
    /**
     * 生成空投订单逻辑对象
     * @param orderId
     */
    static async createAirdropOrderObj(orderId: string): Promise<void> {
        if (!(await ipcHelpers.request(`${WORKER.ORDER}`, CMD.CREATE_AIRDROP_ORDER_OBJ, { orderId }))) {
            Logger.warn(`${CMD.CREATE_AIRDROP_ORDER_OBJ} orderId:${orderId} fail`);
        }
    }

    /**
     * 获取空投订单名称
     * @param type
     * @returns
     */
    static getAirdropTypeName(type: AIRDROP_TYPE): string {
        switch (type) {
            case AIRDROP_TYPE.NORMAL:
                return "普通空投";
            case AIRDROP_TYPE.LIMITED:
                return "限量集空投";
            default:
                throw Error(`getAirdropTypeName error. type:${type}`);
        }
    }

    /**
     * 获取空投记录状态
     * @param orderState
     * @returns
     */
    static getAirdropRecordState(orderState: AIRDROP_ORDER_STATE_ID): AIRDROP_RECORD_STATE {
        switch (orderState) {
            case AIRDROP_ORDER_STATE_ID.INIT:
            case AIRDROP_ORDER_STATE_ID.ISSUE_TX_WAIT_ON_CHAIN:
                return AIRDROP_RECORD_STATE.ISSUE;
            case AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN:
                return AIRDROP_RECORD_STATE.TRANSFER;
            case AIRDROP_ORDER_STATE_ID.SUCCESS:
                return AIRDROP_RECORD_STATE.SUCCESS;
            case AIRDROP_ORDER_STATE_ID.ISSUE_TX_ON_CHAIN_FAIL:
            case AIRDROP_ORDER_STATE_ID.TRANSFER_TX_ON_CHAIN_FAIL:
                return AIRDROP_RECORD_STATE.FAIL;
            default:
                break;
        }
        throw Error(`getAirdropRecordState error. orderState:${orderState} is wrong`);
    }
}
