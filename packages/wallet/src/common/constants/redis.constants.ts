/**RedisRepository名字 */
export const enum REDIS_REPOSITORY_NAME {
    /**链信息 */
    CHAIN_INFO = "chainInfo",
}

/**全局唯一id枚举 */
export const enum GLOBAL_VALUE_ENTITY_ID {
    /**账号存放 */
    ACCOUNT = "account",
}

/**链信息key类型 */
export const enum CHAIN_INFO_KEY_TYPE {
    /**外链交易查询次数 */
    EXTERNAL_TRANS_QUERY = "externalTransQuery",
}

/**链信息hKey */
export const enum CHAIN_INFO_HKEY {
    /**远端最新高度 */
    REMOTE_HEIGHT = "remoteHeight",
    /**本地已同步高度 */
    LOCAL_HEIGHT = "localHeight",
    /**远端magic */
    REMOTE_MAGIC = "remoteMagic",
}
