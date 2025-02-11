import { MqPublisher } from "@bnqkl/server-util";
import {
    COMMON_ORDER_EXCHANGE_NAME,
    COMMON_ORDER_QUEUE_ROUTING_KEY,
    COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY,
    TRANS_EXCHANGE_NAME,
    TRANS_QUEUE_ROUTING_KEY,
    TRANS_TEMP_QUEUE_ROUTING_KEY,
} from "@bnqkl/wallet-sdk";
import { LOCAL_MQ_ID } from "../../common";

export class WalletPublisher extends MqPublisher {
    /**
     * 生产上链事件
     * @param routingKey
     * @param data
     * @param mqId
     * @param bTemp
     * @param timeOffset
     * @returns
     */
    async publishOnChainEvent(
        routingKey: TRANS_QUEUE_ROUTING_KEY | TRANS_TEMP_QUEUE_ROUTING_KEY,
        data: WalletServerSdk.Mq.ConsumeOnChainEventData,
        mqId: string,
        bTemp = false,
        timeOffset?: number,
    ): Promise<void> {
        await this.publishEvent(TRANS_EXCHANGE_NAME.ON_CHAIN, TRANS_EXCHANGE_NAME.ON_CHAIN_DEAD_LETTER, routingKey, data, mqId, bTemp, timeOffset);
    }

    /**
     * 生产人民币支付事件
     * @param routingKey
     * @param data
     * @param mqId
     * @param bTemp
     * @param timeOffset
     * @returns
     */
    async publishRmbPayEvent(
        routingKey: TRANS_QUEUE_ROUTING_KEY | TRANS_TEMP_QUEUE_ROUTING_KEY,
        data: WalletServerSdk.Mq.ConsumeRmbPayEventData,
        mqId: string,
        bTemp = false,
        timeOffset?: number,
    ): Promise<void> {
        await this.publishEvent(TRANS_EXCHANGE_NAME.RMB_PAY, TRANS_EXCHANGE_NAME.RMB_PAY_DEAD_LETTER, routingKey, data, mqId, bTemp, timeOffset);
    }

    /**
     * 生产通用订单事件
     * @param routingKey
     * @param data
     * @param bTemp
     * @param timeOffset
     * @returns
     */
    async publishCommonOrderEvent(
        routingKey: COMMON_ORDER_QUEUE_ROUTING_KEY | COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY,
        data: WalletServerSdk.Mq.ConsumeOrderEventData,
        mqId?: string,
        bTemp = false,
        timeOffset?: number,
    ): Promise<void> {
        // 放入wallet本地的队列
        await this.publishEvent(
            COMMON_ORDER_EXCHANGE_NAME.ORDER,
            COMMON_ORDER_EXCHANGE_NAME.ORDER_DEAD_LETTER,
            routingKey,
            data,
            LOCAL_MQ_ID,
            bTemp,
            timeOffset,
        );
        if (!mqId || mqId === LOCAL_MQ_ID) {
            return;
        }
        await this.publishEvent(COMMON_ORDER_EXCHANGE_NAME.ORDER, COMMON_ORDER_EXCHANGE_NAME.ORDER_DEAD_LETTER, routingKey, data, mqId, bTemp, timeOffset);
    }
}
