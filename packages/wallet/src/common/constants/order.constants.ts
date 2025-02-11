/**订单类型 */
export enum ORDER_TYPE {
    /**空投订单 */
    AIRDROP = "airdrop",
}

/**
 * 交易关联业务类型
 */
export enum TRANSACTION_LINK_TYPE {
    /**无关联 */
    NONE = 0,
    /**与空投订单关联 */
    AIRDROP_ORDER = 1,
}
