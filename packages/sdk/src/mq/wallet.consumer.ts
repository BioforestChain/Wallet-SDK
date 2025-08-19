import { MqConsumer } from "@bnqkl/server-util";
import {
    COMMON_ORDER_EXCHANGE_NAME,
    COMMON_ORDER_QUEUE_ROUTING_KEY,
    COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY,
    TRANS_EXCHANGE_NAME,
    TRANS_QUEUE_ROUTING_KEY,
    TRANS_TEMP_QUEUE_ROUTING_KEY,
} from "./constants.js";

export class WalletConsumer extends MqConsumer {
    /**
     * 查看上链事件队列的信息
     * @param routingKey
     * @param mqId
     * @param bTemp
     * @returns
     */
    async checkOnChainEventQueue(routingKey: TRANS_QUEUE_ROUTING_KEY | TRANS_TEMP_QUEUE_ROUTING_KEY, mqId: string, bTemp = false) {
        return await this.checkEventQueue(TRANS_EXCHANGE_NAME.ON_CHAIN, TRANS_EXCHANGE_NAME.ON_CHAIN_DEAD_LETTER, routingKey, mqId, bTemp);
    }

    /**
     * 消费上链事件
     * @param routingKey
     * @param onConsumeNormalCallback 消费普通队列的回调函数
     * @param mqId
     * @param bTemp
     * @param dlxOpts 死信队列选项
     * @param afterAckNormalCallback 确认消费普通队列之后的回调函数
     */
    async consumeOnChainEvent(
        routingKey: TRANS_QUEUE_ROUTING_KEY | TRANS_TEMP_QUEUE_ROUTING_KEY,
        onConsumeNormalCallback: (args: WalletServerSdk.Mq.ConsumeOnChainEventData) => Promise<void>,
        mqId: string,
        bTemp = false,
        dlxOpts?: {
            expiration?: number;
            onConsumeDLXCallback?: (args: WalletServerSdk.Mq.ConsumeOnChainEventData) => Promise<void>;
        },
        afterAckNormalCallback?: (args: WalletServerSdk.Mq.ConsumeOnChainEventData) => Promise<void>,
    ) {
        return await this.consumeEvent(
            TRANS_EXCHANGE_NAME.ON_CHAIN,
            TRANS_EXCHANGE_NAME.ON_CHAIN_DEAD_LETTER,
            routingKey,
            onConsumeNormalCallback,
            mqId,
            bTemp,
            dlxOpts,
            afterAckNormalCallback,
        );
    }

    /**
     * 查看人民币支付队列的信息
     * @param routingKey
     * @param mqId
     * @param bTemp
     * @returns
     */
    async checkRmbPayEventQueue(routingKey: TRANS_QUEUE_ROUTING_KEY | TRANS_TEMP_QUEUE_ROUTING_KEY, mqId: string, bTemp = false) {
        return await this.checkEventQueue(TRANS_EXCHANGE_NAME.RMB_PAY, TRANS_EXCHANGE_NAME.RMB_PAY_DEAD_LETTER, routingKey, mqId, bTemp);
    }

    /**
     * 消费人民币支付事件
     * @param routingKey
     * @param onConsumeNormalCallback 消费普通队列的回调函数
     * @param mqId
     * @param bTemp
     * @param dlxOpts 死信队列选项
     * @param afterAckNormalCallback 确认消费普通队列之后的回调函数
     */
    async consumeRmbPayEvent(
        routingKey: TRANS_QUEUE_ROUTING_KEY | TRANS_TEMP_QUEUE_ROUTING_KEY,
        onConsumeNormalCallback: (args: WalletServerSdk.Mq.ConsumeRmbPayEventData) => Promise<void>,
        mqId: string,
        bTemp = false,
        dlxOpts?: {
            expiration?: number;
            onConsumeDLXCallback?: (args: WalletServerSdk.Mq.ConsumeRmbPayEventData) => Promise<void>;
        },
        afterAckNormalCallback?: (args: WalletServerSdk.Mq.ConsumeRmbPayEventData) => Promise<void>,
    ) {
        return await this.consumeEvent(
            TRANS_EXCHANGE_NAME.RMB_PAY,
            TRANS_EXCHANGE_NAME.RMB_PAY_DEAD_LETTER,
            routingKey,
            onConsumeNormalCallback,
            mqId,
            bTemp,
            dlxOpts,
            afterAckNormalCallback,
        );
    }

    /**
     * 消费通用订单事件
     * @param routingKey
     * @param onConsumeNormalCallback 消费普通队列的回调函数
     * @param mqId
     * @param bTemp
     * @param dlxOpts 死信队列选项
     * @param afterAckNormalCallback 确认消费普通队列之后的回调函数
     */
    async consumeCommonOrderEvent(
        routingKey: COMMON_ORDER_QUEUE_ROUTING_KEY | COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY,
        onConsumeNormalCallback: (args: WalletServerSdk.Mq.ConsumeOrderEventData) => Promise<void>,
        mqId: string,
        bTemp = false,
        dlxOpts?: {
            expiration?: number;
            onConsumeDLXCallback?: (args: WalletServerSdk.Mq.ConsumeOrderEventData) => Promise<void>;
        },
        afterAckNormalCallback?: (args: WalletServerSdk.Mq.ConsumeOrderEventData) => Promise<void>,
    ) {
        return await this.consumeEvent(
            COMMON_ORDER_EXCHANGE_NAME.ORDER,
            COMMON_ORDER_EXCHANGE_NAME.ORDER_DEAD_LETTER,
            routingKey,
            onConsumeNormalCallback,
            mqId,
            bTemp,
            dlxOpts,
            afterAckNormalCallback,
        );
    }
}
