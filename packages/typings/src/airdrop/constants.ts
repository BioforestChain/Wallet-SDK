/**接口请求地址 */
export enum WALLET_AIRDROP_API_REQUEST {
    /**空投 */
    AIRDROP = "/airdrop",
    /**空投订单重试发行交易上链 */
    RETRY_ISSUE_TX_ONCHAIN = "/airdrop/retryIssueTxOnChain",
    /**空投订单重试转移交易上链 */
    RETRY_TRANSFER_TX_ONCHAIN = "/airdrop/retryTransferTxOnChain",
    /**获取空投记录列表 */
    RECORDS = "/airdrop/records",
    /**获取空投记录详情 */
    RECORD_DETAIL = "/airdrop/recordDetail",
}

/**空投订单状态 */
export enum AIRDROP_ORDER_STATE_ID {
    /**初始 */
    INIT = 1,
    /**等待发行交易上链 */
    ISSUE_TX_WAIT_ON_CHAIN = 2,
    /**发行交易上链失败 */
    ISSUE_TX_ON_CHAIN_FAIL = 201,
    /**等待转移交易上链 */
    TRANSFER_TX_WAIT_ON_CHAIN = 3,
    /**转移交易上链失败 */
    TRANSFER_TX_ON_CHAIN_FAIL = 301,
    /**成功 */
    SUCCESS = 4,
}

/**空投记录状态 */
export enum AIRDROP_RECORD_STATE {
    /**空投发行中 */
    ISSUE = 1,
    /**空投转移中 */
    TRANSFER = 2,
    /**空投成功 */
    SUCCESS = 3,
    /**空投失败 */
    FAIL = 4,
}

/**空投类型 */
export enum AIRDROP_TYPE {
    /**普通空投 */
    NORMAL = 1,
    /**限量集空投 */
    LIMITED = 2,
}

/**
 * DP等级
 */
export enum DP_LEVEL {
    /**普通 */
    ORDINARY = 1,
    /**稀有 */
    RARE = 2,
    /**史诗 */
    EPIC = 3,
    /**传奇 */
    LEGENDARY = 4,
}

/**
 * DP文件类型
 */
export enum DP_FILE_TYPE {
    /**普通图片 */
    ORDINARY_PIC = 1,
    /**3D图片 */
    THREED_PIC = 2,
}
