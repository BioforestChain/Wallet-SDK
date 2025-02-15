/**内链接口请求地址 */
export enum WALLET_INTERNAL_CHAIN_API_REQUEST {
    /**获取内链最新区块 */
    GET_LAST_BLOCK = "/internalChain/getLastBlock",
    /**获取内链区块 */
    GET_BLOCK = "/internalChain/getBlock",
    /**生成内链转账交易 */
    CREATE_TRANSFER = "/internalChain/createTransfer",
    /**生成权益转移交易 */
    CREATE_TRANSFER_ASSET = "/internalChain/createTransferAsset",
    /**生成发行权益交易 */
    CREATE_ISSUE_ASSET = "/internalChain/createIssueAsset",
    /**生成增发权益交易 */
    CREATE_INCREASE_ASSET = "/internalChain/createIncreaseAsset",
    /**生成销毁权益交易 */
    CREATE_DESTROY_ASSET = "/internalChain/createDestroyAsset",
    /**生成质押权益交易 */
    CREATE_STAKE_ASSET = "/internalChain/createStakeAsset",
    /**生成解除质押权益交易 */
    CREATE_UNSTAKE_ASSET = "/internalChain/createUnstakeAsset",
    /**生成发行非同质资产模板交易 */
    CREATE_ISSUE_ENTITY_FACTORY = "/internalChain/createIssueEntityFactory",
    /**生成发行非同质资产交易 */
    CREATE_ISSUE_ENTITY = "/internalChain/createIssueEntity",
    /**生成批量发行非同质资产交易 */
    CREATE_ISSUE_ENTITY_MULTI = "/internalChain/createIssueEntityMulti",
    /**生成转移资产交易 */
    CREATE_TRANSFER_ENTITY = "/internalChain/createTransferEntity",
    /**保存内链转账交易 */
    SAVE_TRANSFER = "/internalChain/saveTransfer",
    /**保存内链交易 */
    SAVE_TRANSACTION = "/internalChain/saveTransaction",
    /**生成内链交易逻辑对象 */
    CREATE_TRANS_OBJ = "/internalChain/createTransObj",
    /**获取内链交易 */
    GET_TRANS = "/internalChain/getTrans",
    /**获取内链账户余额 */
    GET_ACCOUNT_BALANCE = "/internalChain/getAccountBalance",
    /**更新内链交易状态 */
    UPDATE_TRANS_STATE = "/internalChain/updateTransState",
    /**获取链的资产信息 */
    GET_ALL_ACOUNT_BALANCE = "/internalChain/accounts/balance",
    /**生成内链投票交易 */
    CREATE_VOTE_TR = "/internalChain/createVoteTr",
    /**上传文件 */
    UPLOAD_FILE = "/internalChain/uploadFile",
    /**批量上传文件 */
    UPLOAD_FILES = "/internalChain/uploadFiles",
    /**下载文件 */
    DOWNLOAD_FILE = "/internalChain/downloadFile",
    /**获取内链资产详情 */
    GET_ASSET_DETAILS = "/internalChain/getAssetDetails",
}

/**bcf接口请求地址 */
export enum WALLET_BCF_API_REQUEST {
    /**获取最新区块 */
    GET_LAST_BLOCK = "/lastblock",
    /**获取最新区块高度 */
    GET_LAST_BLOCK_HEIGHT = "/lastblockHeight",
    /**查询区块 */
    QUERY_BLOCK = "/block/query",
    /**查询链上交易 */
    QUERY_TRANSACTION = "/transactions/query",
    /**广播事件 */
    BROADCAST_TRANSACTION = "/transactions/broadcast",
    /**广播事件 */
    BROADCAST_TRANSACTION_NOTIFY = "/transactions/broadcast/notify",
    /**创建转账事件 */
    CREATE_TRANSFER_ASSET = "/transactions/createTransferAsset",
    /**创建转账事件(安全密钥) */
    PACKAGE_TRANSFER_ASSET = "/transactions/packageTransferAsset",
    /**广播转账事件 */
    BROADCAST_TRANSFER_ASSET = "/transactions/broadcastTransferAsset",
    /**创建交易密码事件 */
    CREATE_SIGNATURE = "/transactions/createSignature",
    /**创建交易密码事件(安全密钥) */
    PACKAGE_SIGNATURE = "/transactions/packageSignature",
    /**广播交易密码事件 */
    BROADCAST_SIGNATURE = "/transactions/broadcastSignature",
    /**获取地址余额 */
    GET_ADDRESS_BALANCE = "/address/balance",
    /**获取地址相关信息 */
    GET_ADDRESS_INFO = "/address/info",
    /**获取近一轮区块平均手续费 */
    GET_BLOCK_AVE_FEE = "/blockAveFee",
    /**获取pending状态的交易 */
    GET_PENDING_TR = "/pendingTr",
    /**获取地址资产信息 */
    GET_ADDRESS_ASSET = "/address/asset",
    /**获取代币资产列表 */
    GET_ASSETS = "/assets",
    /**获取代币资产详情 */
    GET_ASSET_DETAILS = "/asset/details",
    /**每字节最小手续费 */
    GET_MIN_PER_BYTE = "/minperbyte",
}

/**内链交易状态 */
export enum InternalTransStateID {
    /**初始 */
    INIT = 1,
    /**等待上链 */
    WAIT_ON_CHAIN = 2,
    /**上链失败 */
    ON_CHAIN_FAIL = 201,
    /**成功 */
    SUCCESS = 3,
}

/**内链名 */
export enum InternalChainName {
    /**bfchainv2 新链 */
    BFCHAINV2 = "BFCHAINV2",
    /**白富美 */
    BFMCHAIN = "BFMCHAIN",
    /**碳链 */
    CCCHAIN = "CCCHAIN",
    /**支付链 */
    PMCHAIN = "PMCHAIN",
    /**ETHM */
    ETHMETA = "ETHMETA",
    /**BTGMETA */
    BTGMETA = "BTGMETA",
    /**BTCMETA */
    BTCMETA = "BTCMETA",
    /**BIWMETA */
    BIWMETA = "BIWMETA",
}

/**内链支持交易的货币类型 */
export enum InternalAssetType {
    USDT = "USDT",
    USDM = "USDM",
    BFM = "BFM",
    CCC = "CCC",
    PMC = "PMC",
    ETHM = "ETHM",
    BFT = "BFT",
    BTGM = "BTGM",
    BIW = "BIW",
}

/** 内链主币种 */
export enum InternalMainAssetType {
    BFM = "BFM",
    BFMTEST = "BFMTEST",
    CCC = "CCC",
    PMC = "PMC",
    ETHM = "ETHM",
    BFT = "BFT",
    BTGM = "BTGM",
    BIW = "BIW",
}

/**默认手续费 */
export const DEFAULT_FEE = "100000";

/**默认过期区块数 */
export const NUMBER_OF_EFFECTIVE_BLOCKS = 50;

/**一个代币 = 100,000,000 本 */
export const TOKEN_TO_BEN = BigInt(100000000);

/**生物链林默认精度 */
export const BCF_DEFAULT_DECIMALS = 8;
