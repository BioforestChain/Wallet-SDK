import { staticConfig } from "../../config/index.js";

export const LOCAL_MQ_ID = staticConfig.mysql.dbName;

/**业务处理交换机名字 */
export enum BUSINESS_EXCHANGE_NAME {
    /**业务处理普通交换机 */
    BUSINESS = "business_exchange",
    /**业务处理死信交换机 */
    BUSINESS_DEAD_LETTER = "business_deadLetter_exchange",
}

/**业务处理消息队列的路由key */
export enum BUSINESS_QUEUE_ROUTING_KEY {
    /**支付宝交易通知 */
    ALIPAY_NOTIFY = "alipayNotify",
}

/**业务处理临时消息队列的路由key */
export enum BUSINESS_TEMP_QUEUE_ROUTING_KEY {}
