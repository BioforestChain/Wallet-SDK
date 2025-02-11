/**外链接口请求地址 */
export enum WALLET_EXTERNAL_CHAIN_API_REQUEST {
    /**生成外链转账交易 */
    CREATE_TRANSFER = "/externalChain/createTransfer",
    /**保存外链转账交易 */
    SAVE_TRANSFER = "/externalChain/saveTransfer",
    /**保存外链交易 */
    SAVE_TRANSACTION = "/externalChain/saveTransaction",
    /**生成外链交易逻辑对象 */
    CREATE_TRANS_OBJ = "/externalChain/createTransObj",
    /**获取外链交易 */
    GET_TRANS = "/externalChain/getTrans",
    /**获取外链交易手续费信息 */
    GET_TRANS_FEE_INFO = "/externalChain/getTransFeeInfo",
    /**获取外链主币余额 */
    GET_BALANCE = "/externalChain/getBalance",
    /**获取外链账户余额 */
    GET_ACCOUNT_BALANCE = "/externalChain/getAccountBalance",
    /**更新外链交易状态 */
    UPDATE_TRANS_STATE = "/externalChain/updateTransState",
    /**获取外链打块间隔 */
    GET_FORGE_INTERVAL = "/externalChain/getForgeInterval",
}

/**合约信息接口请求地址 */
export enum WALLET_CONTRACT_TOKEN_INFO_API_REQUEST {
    /**获取合约token信息 */
    GET_TOKEN_INFO = "/contractTokenInfo/getTokenInfo",
    /**指定链名称，获取合约信息列表 */
    GET_TOKEN_BY_CHAIN = "/contractTokenInfo/getTokenByChain",
}

/**eth接口请求地址 */
export enum WALLET_ETH_API_REQUEST {
    /**eth-获取最新区块 */
    GET_LAST_BLOCK = "/eth/block",
    /**eth-获取区块 */
    GET_BLOCK = "/eth/block/query",
    /**eth-获取chainId */
    GET_CHAIN_ID = "/eth/getChainId",
    /**eth-获取基础Gas信息 */
    GET_BASE_GAS = "/eth/baseGas",
    /**eth-获取GasPrice信息 */
    GET_GAS_PRICE = "/eth/gasPrice",
    /**eth-获取用户余额信息 */
    GET_BALANCE = "/eth/balance",
    /**eth-获取用户交易数 */
    GET_TRANS_COUNT = "/eth/trans/count",
    /**eth-交易前需要的预备信息 */
    TRANS_PREP = "/eth/trans/prep",
    /**eth-获取用户合约余额信息 */
    GET_CONTRACT_BALANCE = "/eth/balance/erc20",
    /**eth-获取合约交易的data */
    GET_CONTRACT_DATA = "/eth/trans/erc20/data",
    /**eth-发送已签名的交易 */
    TRANS_SEND = "/eth/trans/send",
    /**eth-查询指定地址的普通交易历史 */
    GET_NORMAL_HISTORY = "/eth/trans/normal/history",
    /**eth-查询指定地址的合约交易历史 */
    GET_CONTRACT_HISTORY = "/eth/trans/erc20/history",
    /**eth-查询合约代币列表(只提供ERC20协议的代币) */
    GET_CONTRACT_TOKENS = "/eth/contract/tokens",
    /**eth-查询合约代币详情 */
    GET_CONTRACT_TOKEN_DETAIL = "/eth/contract/token/detail",
    /**eth-查询账户余额V2 */
    GET_BALANCE_V2 = "/eth/account/balance/v2",
    /**eth-查询pending状态交易 */
    TRANS_PENDING = "/eth/trans/pending",
    /**eth-交易基础信息查询 */
    TRANS_QUERY = "/eth/trans/query",
    /**eth-对交易数据进行签名(仅测试环境使用) */
    TRANS_SIGN = "/eth/trans/sign",
    /**eth-普通交易测试(仅测试环境使用) */
    TRANS_CREATE = "/eth/trans/create",
    /**eth-合约交易测试(仅测试环境使用) */
    TRANS_ERC20_CREATE = "/eth/trans/erc20/create",
    /**eth-直接广播 */
    BROADCAST_DIRECT = "/eth/broadcast/direct",
}

/**bsc接口请求地址 */
export enum WALLET_BSC_API_REQUEST {
    /**bsc-获取最新区块 */
    GET_LAST_BLOCK = "/bsc/block",
    /**bsc-获取区块 */
    GET_BLOCK = "/bsc/block/query",
    /**bsc-获取chainId */
    GET_CHAIN_ID = "/bsc/getChainId",
    /**bsc-获取基础Gas信息 */
    GET_BASE_GAS = "/bsc/baseGas",
    /**bsc-获取GasPrice信息 */
    GET_GAS_PRICE = "/bsc/gasPrice",
    /**bsc-获取用户余额信息 */
    GET_BALANCE = "/bsc/balance",
    /**bsc-获取用户交易数 */
    GET_TRANS_COUNT = "/bsc/trans/count",
    /**bsc-交易前需要的预备信息 */
    TRANS_PREP = "/bsc/trans/prep",
    /**bsc-获取用户合约余额信息 */
    GET_CONTRACT_BALANCE = "/bsc/balance/bep20",
    /**bsc-获取合约交易的data */
    GET_CONTRACT_DATA = "/bsc/trans/bep20/data",
    /**bsc-发送已签名的交易 */
    TRANS_SEND = "/bsc/trans/send",
    /**bsc-查询指定地址的普通交易历史 */
    GET_NORMAL_HISTORY = "/bsc/trans/normal/history",
    /**bsc-查询指定地址的合约交易历史 */
    GET_CONTRACT_HISTORY = "/bsc/trans/bep20/history",
    /**bsc-查询合约代币列表(只提供BEP20协议的代币) */
    GET_CONTRACT_TOKENS = "/bsc/contract/tokens",
    /**bsc-查询合约代币详情 */
    GET_CONTRACT_TOKEN_DETAIL = "/bsc/contract/token/detail",
    /**bsc-查询账户余额V2 */
    GET_BALANCE_V2 = "/bsc/account/balance/v2",
    /**bsc-查询pending状态交易 */
    TRANS_PENDING = "/bsc/trans/pending",
    /**bsc-交易基础信息查询 */
    TRANS_QUERY = "/bsc/trans/query",
    /**bsc-对交易数据进行签名(仅测试环境使用) */
    TRANS_SIGN = "/bsc/trans/sign",
    /**bsc-普通交易测试(仅测试环境使用) */
    TRANS_CREATE = "/bsc/trans/create",
    /**bsc-合约交易测试(仅测试环境使用) */
    TRANS_BEP20_CREATE = "/bsc/trans/bep20/create",
    /**bsc-直接广播 */
    BROADCAST_DIRECT = "/bsc/broadcast/direct",
}

/**tron接口请求地址 */
export enum WALLET_TRON_API_REQUEST {
    /**tron-获取最新区块信息 */
    GET_LAST_BLOCK = "/tron/nowBlock",
    /**tron-获取用户余额 */
    GET_BALANCE = "/tron/balance",
    /**tron-获取账户信息 */
    GET_ACCOUNT = "/tron/account",
    /**tron-获取账户资源信息 */
    GET_ACCOUNT_RESOURCE = "/tron/account/resource",
    /**tron-获取指定合约代币余额 */
    GET_CONTRACT_BALANCE = "/tron/balance/trc20",
    /**tron-获取指定合约代币余额V2 */
    GET_CONTRACT_BALANCE_V2 = "/tron/balance/trc20/v2",
    /**tron-获取指定合约代币精度 */
    GET_CONTRACT_DECIMAL = "/tron/decimal/trc20",
    /**tron-获取指定合约代币精度V2 */
    GET_CONTRACT_DECIMAL_V2 = "/tron/decimal/trc20/v2",
    /**tron-获取合约余额和精度 */
    GET_CONTRACT_BALANCE_AND_DECIMAL = "/tron/contract/balance",
    /**tron-获取合约余额和精度V2 */
    GET_CONTRACT_BALANCE_AND_DECIMAL_V2 = "/tron/contract/balance/v2",
    /**tron-创建TRX普通交易 */
    CREATE_NORMAL_TRANS = "/tron/trans/create",
    /**tron-创建TRX普通交易V2 */
    CREATE_NORMAL_TRANS_V2 = "/tron/send/trx",
    /**tron-创建TRC20交易 */
    CREATE_CONTRACT_TRANS = "/tron/trans/contract",
    /**tron-创建TRC20交易V2 */
    CREATE_CONTRACT_TRANS_V2 = "/tron/send/trc20",
    /**tron-普通转账交易广播 */
    BROADCAST_NORMAL_TRANS = "/tron/trans/broadcast",
    /**tron-TRC20交易广播 */
    BROADCAST_CONTRACT_TRANS = "/tron/trans/trc20/broadcast",
    /**tron-查询指定地址的普通交易历史 */
    GET_NORMAL_HISTORY = "/tron/trans/common/history",
    /**tron-查询指定地址的合约交易历史 */
    GET_CONTRACT_HISTORY = "/tron/trans/trc20/history",
    /**tron-查询合约代币列表(只提供TRC20协议的代币) */
    GET_CONTRACT_TOKENS = "/tron/contract/tokens",
    /**tron-查询合约代币详情 */
    GET_CONTRACT_TOKEN_DETAIL = "/tron/contract/token/detail",
    /**tron-查询账户余额V2 */
    GET_BALANCE_V2 = "/tron/account/balance/v2",
    /**tron-查询pending状态交易 */
    TRANS_PENDING = "/tron/trans/pending",
    /**tron-查询已完成交易详情 */
    TRANS_RECEIPT = "/tron/trans/receipt",
    /**tron-直接广播 */
    BROADCAST_DIRECT = "/tron/broadcast/direct",
}

/** 外链交易类型 */
export enum ExternalTransType {
    /** 普通交易 */
    COMMON = 1,
    /** 合约交易 */
    CONTRACT = 2,
}

/**外链交易状态 */
export enum ExternalTransStateID {
    /**初始 */
    INIT = 1,
    /**等待上链 */
    WAIT_ON_CHAIN = 2,
    /**上链失败 */
    ON_CHAIN_FAIL = 201,
    /**成功 */
    SUCCESS = 3,
}

/**外链名 */
export enum ExternalChainName {
    /**以太坊 */
    ETH = "ETH",
    /**币安 */
    BSC = "BSC",
    /**波场 */
    TRON = "TRON",
}

/**外链支持交易的货币类型 */
export enum ExternalAssetType {
    USDT = "USDT",
    USDC = "USDC",
    ETH = "ETH",
    FIL = "FIL",
}

/** 外链主币种 */
export enum ExternalMainAssetType {
    ETH = "ETH",
    BNB = "BNB",
    TRX = "TRX",
}

/** 外链主币种精度 */
export enum ExternalMainAssetDecimal {
    ETH = 18,
    BNB = 18,
    TRX = 6,
}
