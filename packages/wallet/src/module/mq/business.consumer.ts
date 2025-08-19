import { MqConsumer } from "@bnqkl/wallet-sdk";
import { BUSINESS_EXCHANGE_NAME, BUSINESS_QUEUE_ROUTING_KEY, LOCAL_MQ_ID } from "../../common.js";

export class BusinessConsumer extends MqConsumer {
    /**
     * 消费业务处理事件
     * @param routingKey
     * @param onConsumeNormalCallback 消费普通队列的回调函数
     * @param bTemp
     * @param dlxOpts 死信队列选项
     * @param afterAckNormalCallback 确认消费普通队列之后的回调函数
     */
    private async __consumeBusinessEvent<RoutingKey extends BUSINESS_QUEUE_ROUTING_KEY, EventDataType extends {}>(
        routingKey: RoutingKey,
        onConsumeNormalCallback: (args: EventDataType) => Promise<void>,
        bTemp = false,
        dlxOpts?: {
            expiration?: number;
            onConsumeDLXCallback?: (args: EventDataType) => Promise<void>;
        },
        afterAckNormalCallback?: (args: EventDataType) => Promise<void>,
    ) {
        return await this.consumeEvent(
            BUSINESS_EXCHANGE_NAME.BUSINESS,
            BUSINESS_EXCHANGE_NAME.BUSINESS_DEAD_LETTER,
            routingKey,
            onConsumeNormalCallback,
            LOCAL_MQ_ID,
            bTemp,
            dlxOpts,
            afterAckNormalCallback,
        );
    }

    /**
     * 消费支付宝交易通知
     */
    consumeAlipayNotifyEvent = this.__consumeBusinessEvent<BUSINESS_QUEUE_ROUTING_KEY.ALIPAY_NOTIFY, Wallet.Mq.ConsumeAlipayNotifyEventData>;
}
