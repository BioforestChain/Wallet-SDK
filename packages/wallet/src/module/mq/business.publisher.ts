import { MqPublisher } from "@bnqkl/wallet-sdk";
import { BUSINESS_EXCHANGE_NAME, BUSINESS_QUEUE_ROUTING_KEY, LOCAL_MQ_ID } from "../../common";

export class BusinessPublisher extends MqPublisher {
    /**
     * 生产业务处理事件
     * @param routingKey
     * @param data
     * @param bTemp
     * @param timeOffset
     * @returns
     */
    private async __publishBusinessEvent<RoutingKey extends BUSINESS_QUEUE_ROUTING_KEY, EventDataType extends {}>(
        routingKey: RoutingKey,
        data: EventDataType,
        bTemp = false,
        timeOffset?: number,
    ) {
        return await this.publishEvent(
            BUSINESS_EXCHANGE_NAME.BUSINESS,
            BUSINESS_EXCHANGE_NAME.BUSINESS_DEAD_LETTER,
            routingKey,
            data,
            LOCAL_MQ_ID,
            bTemp,
            timeOffset,
        );
    }

    /**
     * 生产支付宝交易通知
     */
    publishAlipayNotifyEvent = this.__publishBusinessEvent<BUSINESS_QUEUE_ROUTING_KEY.ALIPAY_NOTIFY, Wallet.Mq.ConsumeAlipayNotifyEventData>;
}
