export class OrderBaseHelper {
    /**
     * 获取订单的分布式锁的key
     * @param orderId
     * @returns
     */
    static getOrderLockKey(orderId: string) {
        return `orderLock:${orderId}`;
    }
}
