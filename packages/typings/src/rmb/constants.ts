/**接口请求地址 */
export enum WALLET_RMB_API_REQUEST {
    /**保存人民币交易 */
    SAVE_TRANSACTION = "/rmb/saveTransaction",
    /**生成人民币交易逻辑对象 */
    CREATE_TRANS_OBJ = "/rmb/createTransObj",
    /**获取人民币交易 */
    GET_TRANS = "/rmb/getTrans",
    /**更新人民币交易状态 */
    UPDATE_TRANS_STATE = "/rmb/updateTransState",
    /**支付宝订单异步回调通知 */
    ALI_PAY_NOTIFY = "/rmb/alipay/notify",
}

/**人民币交易状态 */
export enum RMB_TRANS_STATE_ID {
    /**初始 */
    INIT = 1,
    /**等待支付 */
    WAIT_PAY = 2,
    /**支付失败 */
    PAY_FAIL = 201,
    /**支付成功 */
    SUCCESS = 3,
}

/**人民币支付平台 */
export enum RMB_PAY_PLATFORM {
    /**支付宝 */
    ALI_PAY = 1,
    /**微信支付 */
    WECHAT_PAY = 2,
}

/**支付宝交易状态 */
export enum ALIPAY_TRADE_STATUS {
    /**交易创建，等待买家付款 */
    WAIT_BUYER_PAY = "WAIT_BUYER_PAY",
    /**未付款交易超时关闭，或支付完成后全额退款 */
    TRADE_CLOSED = "TRADE_CLOSED",
    /**交易支付成功 */
    TRADE_SUCCESS = "TRADE_SUCCESS",
    /**交易结束，不可退款 */
    TRADE_FINISHED = "TRADE_FINISHED",
}
