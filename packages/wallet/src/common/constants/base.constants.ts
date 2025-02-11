export const VERSION = process.env["VERSION"] as string;
export const PROJECT_NAME = process.env["PROJECT_NAME"] as string;

/**进程名 */
export const WORKER = {
    /**WEB服务进程 */
    WEB: "web",
    /**交易处理进程 */
    TRANS: "trans",
    /**主进程 */
    MASTER: "master",
    /**全局进程，集群唯一 */
    GLOBAL: "global",
    /**订单处理进程 */
    ORDER: "order",
    /**所有进程 */
    ALL: "*",
};

export const enum CMD {
    /**生成内链交易逻辑对象 */
    CREATE_INTERNAL_TRANS_OBJ = "CREATE_INTERNAL_TRANS_OBJ",
    /**生成外链交易逻辑对象 */
    CREATE_EXTERNAL_TRANS_OBJ = "CREATE_EXTERNAL_TRANS_OBJ",
    /**生成人民币交易逻辑对象 */
    CREATE_RMB_TRANS_OBJ = "CREATE_RMB_TRANS_OBJ",
    /**生成空投订单逻辑对象 */
    CREATE_AIRDROP_ORDER_OBJ = "CREATE_AIRDROP_ORDER_OBJ",
}
