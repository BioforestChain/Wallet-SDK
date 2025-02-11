export enum API_SCAN_SORT_ENUM {
    ASC = "asc",
    DESC = "desc",
}

/**链上交易类型 */
export enum CHAIN_TRANS_TYPE {
    /**外链交易 */
    EXTERNAL = "external",
    /**内链交易 */
    INTERNAL = "internal",
}

/**二进制文件在remark里的前缀类型 */
export const enum BLOB_IN_TRS_REMARK_PREFIX {
    SHA256 = "blob+sha256+hex://",
}

/**blob 存储文件夹 */
export const BLOBS_SAVE_DIR = "blobs";
/**blob 临时存储文件夹 */
export const BLOBS_TEMPS_SAVE_DIR = "blobs_temps";
