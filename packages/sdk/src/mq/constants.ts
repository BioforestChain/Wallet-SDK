/**交易交换机名字 */
export enum TRANS_EXCHANGE_NAME {
    /**上链事件普通交换机 */
    ON_CHAIN = "onChain_exchange",
    /**上链事件死信交换机 */
    ON_CHAIN_DEAD_LETTER = "onChain_deadLetter_exchange",
    /**人民币交易普通交换机 */
    RMB_PAY = "rmbPay_exchange",
    /**人民币交易死信交换机 */
    RMB_PAY_DEAD_LETTER = "rmbPay_deadLetter_exchange",
}

/**交易消息队列的路由key */
export enum TRANS_QUEUE_ROUTING_KEY {
    /**外链上链成功 */
    EXTERNAL_SUCCESS = "externalSuccess",
    /**外链上链失败 */
    EXTERNAL_FAIL = "externalFail",
    /**内链上链成功 */
    INTERNAL_SUCCESS = "internalSuccess",
    /**内链上链失败 */
    INTERNAL_FAIL = "internalFail",
    /**人民币支付成功 */
    RMB_PAY_SUCCESS = "rmbPaySuccess",
    /**人民币支付失败 */
    RMB_PAY_FAIL = "rmbPayFail",
}

/**交易临时消息队列的路由key */
export enum TRANS_TEMP_QUEUE_ROUTING_KEY {
    /**内链交易开始上链 */
    INTERNAL_ON_CHAIN_START = "internalOnChainStart",
    /**外链交易开始上链 */
    EXTERNAL_ON_CHAIN_START = "externalOnChainStart",
}

/**通用订单事件交换机名字 */
export enum COMMON_ORDER_EXCHANGE_NAME {
    /**订单事件普通交换机 */
    ORDER = "order_exchange",
    /**订单事件死信交换机 */
    ORDER_DEAD_LETTER = "order_deadLetter_exchange",
}

/**通用订单事件消息队列的路由key */
export enum COMMON_ORDER_QUEUE_ROUTING_KEY {
    /**空投订单成功 */
    AIRDROP_ORDER_SUCCESS = "airdropOrderSuccess",
    /**空投订单失败 */
    AIRDROP_ORDER_FAIL = "airdropOrderFail",
}

/**通用订单事件临时消息队列的路由key */
export enum COMMON_ORDER_TEMP_QUEUE_ROUTING_KEY {
    /**空投订单开始发行dp上链 */
    AIRDROP_ORDER_ISSUE_TX_START = "airdropOrderIssueTxStart",
    /**空投订单进入转移状态 */
    AIRDROP_ORDER_ENTER_TRANSFER_STATE = "airdropOrderEnterTransferState",
    /**空投订单开始转移dp上链 */
    AIRDROP_ORDER_TRANSFER_TX_START = "airdropOrderTransferTxStart",
}
