import type { CHAIN_ID } from "../typings/index.js";
import type { ExternalAssetType, ExternalChainName, ExternalTransStateID } from "./constants.js";

export {};
declare global {
    export namespace WalletTypings {
        export namespace ExternalChain {
            export namespace Api {
                /**
                 * 生成外链转账交易
                 * POST /wallet/externalChain/createTransfer
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER
                 */
                export interface CreateExternalTransferReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**发送者账户 */
                    account: WalletAccount;
                    /**接收者地址 */
                    recipientId: string;
                    /**合约地址 */
                    contractAddress?: string;
                    /**转账数量 */
                    amount: string;
                    /**业务参数 */
                    param?: Entity.BusinessParam;
                }
                export interface CreateExternalTransferResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 保存外链交易
                 * POST /wallet/externalChain/saveTransaction
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION
                 */
                export interface SaveExternalTransactionReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**交易体 */
                    transactionJSON: EthTrJson | BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction;
                    /**外链交易详情 */
                    detail: ExternalTransDetail;
                    /**业务参数 */
                    param?: Entity.BusinessParam;
                }
                export interface SaveExternalTransactionResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成外链交易逻辑对象
                 * POST /wallet/externalChain/createTransObj
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ
                 */
                export interface CreateExternalTransObjReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**交易id */
                    txId: string;
                }

                /**
                 * 获取外链交易
                 * GET /wallet/externalChain/getTrans
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS
                 */
                export interface GetExternalTransReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**交易id */
                    txId: string;
                }
                export type GetExternalTransResDto = TransactionBase;

                /**
                 * 获取外链交易手续费信息
                 * GET /wallet/externalChain/getTransFeeInfo
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS_FEE_INFO
                 */
                export type GetExternalTransFeeInfoReqDto = GetExternalTransReqDto;
                export type GetExternalTransFeeInfoResDto = TransFeeInfo | undefined;

                /**
                 * 获取外链主币余额
                 * GET /wallet/externalChain/getBalance
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_BALANCE
                 */
                export interface GetExternalBalanceReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**用户地址 */
                    address: string;
                }
                /**
                 * 获取外链账户余额
                 * GET /wallet/externalChain/getAccountBalance
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE
                 */
                export interface GetExternalAccountBalanceReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**用户地址 */
                    address: string;
                    /**合约地址 */
                    contractAddress: string;
                }
                export interface GetExternalAccountBalanceResDto {
                    contractAddress: string;
                    amount: string;
                    decimals: number;
                    symbol: string;
                    icon: string;
                }

                /**
                 * 更新外链交易状态
                 * POST /wallet/externalChain/updateTransState
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE
                 */
                export interface UpdateExternalTransStateReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**交易id */
                    txId: string;
                    /**交易状态 */
                    state: ExternalTransStateID;
                }
                export type UpdateExternalTransStateResDto = boolean;

                /**
                 * 获取外链打块间隔
                 * GET /wallet/externalChain/getForgeInterval
                 * WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_FORGE_INTERVAL
                 */
                export interface GetExternalForgeIntervalReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                }
                export type GetExternalForgeIntervalResDto = number;
            }

            export interface TransactionBase<TrJsonType extends object = {}>
                extends Entity.ChainTransEntity<ExternalTransStateID, ExternalChainName, TrJsonType> {
                /**交易Hash */
                txHash: string;
                /**交易体已广播 */
                isBroadcasted: boolean;
                /**发起地址 */
                from: string;
                /**接收地址 */
                to: string;
                /**交易金额 */
                value: string;
                /**资产标识 */
                assetSymbol: string;
            }

            /**外链交易详情 */
            export interface TransDetail {
                /**链名 */
                chainName: ExternalChainName;
                /**发送地址 */
                from: string;
                /**接收地址 */
                to: string;
                /**交易数量 */
                amount: string;
                /**交易Hash */
                txHash: string;
                /**合约地址 */
                contractAddress?: string;
            }

            export type WalletAccount = {
                privateKey: string;
                publicKey: string;
                address: string;
                secret: string;
            };

            /**外链交易详情 */
            export interface ExternalTransDetail {
                /**发送地址 */
                from: string;
                /**接收地址 */
                to: string;
                /**交易数量 */
                amount: string;
                /**手续费 */
                fee: string;
                /**货币类型 */
                assetSymbol: string;
                /**合约号 */
                contract?: string;
            }

            /**Eth交易体 */
            export interface EthTrJson {
                /**交易签名数据 */
                signTransData: string;
                /**交易哈希 */
                txHash: string;
            }

            /**交易手续费信息 */
            export type TransFeeInfo = EthTransFeeInfo | TronTransFeeInfo;

            /**Eth手续费信息 */
            export interface EthTransFeeInfo {
                /**燃气单价 */
                gasPrice: string;
                /**使用的燃气数量 */
                gasUsed: string;
            }

            /**tron手续费信息 */
            export interface TronTransFeeInfo {
                /**交易手续费 */
                fee: number;
                /**消耗带宽 */
                netFee: number;
                /**免费带宽 */
                netUsage: number;
                /**燃烧能量获取的资源(TRX) */
                energyFee: number;
                /**免费能量 */
                energyUsage: number;
                /**消耗能量 */
                energyUsageTotal: number;
                originEnergyUsage: number;
            }

            /**发起方交易体 */
            export interface FromTrJson {
                /**以太坊 */
                eth?: { signTransData: string };
                /**币安智能链 */
                bsc?: { signTransData: string };
                /**波场普通 */
                tron?: BFChainWallet.TRON.TronTransaction;
                /**波场合约 */
                trc20?: BFChainWallet.TRON.Trc20Transaction;
            }

            /**接收方交易信息 */
            export interface ToTrInfo {
                /**外链名 */
                chainName: ExternalChainName;
                /**外链地址 */
                address: string;
                /**外链货币类型 */
                assetType: ExternalAssetType;
            }

            /**接收方交易详情 */
            export interface ToTrDetail extends ToTrInfo {
                /**合约地址 */
                contractAddress?: string;
            }
        }

        export namespace ContractTokenInfo {
            export namespace Api {
                /**
                 * 获取合约token信息
                 * GET /wallet/contractTokenInfo/getTokenInfo
                 * WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_INFO
                 */
                export interface TokenInfoReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                    /**合约地址 */
                    contractAddress: string;
                }
                export type TokenInfoResDto = ContractTokenInfo;

                /**
                 * 获取合约token信息
                 * GET /wallet/contractTokenInfo/getTokenByChain
                 * WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_BY_CHAIN
                 */
                export interface TokenInfoByChainReqDto {
                    /**链名 */
                    chainName: ExternalChainName;
                }
                export type TokenInfoByChainResDto = ContractTokenInfo[];
            }

            /**外链合约信息 */
            export interface ContractTokenInfo {
                chain: ExternalChainName;
                address: string;
                name: string;
                icon: string;
                symbol: string;
                decimals: number;
                totalSupply: string;
                website: string;
                publishTime: Date;
            }
        }

        export namespace Eth {
            export namespace Api {
                /**
                 * eth-基础请求
                 */
                export interface EthBaseReqDto {
                    /**用户地址 */
                    address: string;
                }

                /**
                 * eth-获取最新区块
                 * GET /wallet/eth/block
                 * WALLET_ETH_API_REQUEST.GET_LAST_BLOCK
                 */
                export interface EthGetLastBlockResDto {
                    timestamp: number | string;
                }

                /**
                 * eth-获取区块
                 * GET /wallet/eth/block/query
                 * WALLET_ETH_API_REQUEST.GET_BLOCK
                 */
                export interface EthGetBlockReqDto {
                    /**区块id */
                    blockNumber: number;
                }
                export interface EthGetBlockResDto {
                    timestamp: number | string;
                }

                /**
                 * eth-获取chainId
                 * GET /wallet/eth/getChainId
                 * WALLET_ETH_API_REQUEST.GET_CHAIN_ID
                 */
                export type EthGetChainIdResDto = number;

                /**
                 * 获取基础Gas信息
                 * GET /wallet/eth/baseGas
                 * WALLET_ETH_API_REQUEST.GET_BASE_GAS
                 */
                export type EthGetBaseGasResDto = BFChainWallet.ETH.BaseGas;

                /**
                 * eth-获取GasPrice信息
                 * GET /wallet/eth/gasPrice
                 * WALLET_ETH_API_REQUEST.GET_GAS_PRICE
                 */
                export type EthGetGasPriceResDto = string;

                /**
                 * eth-获取用户余额信息
                 * GET /wallet/eth/balance
                 * WALLET_ETH_API_REQUEST.GET_BALANCE
                 */
                export type EthGetBalanceReqDto = EthBaseReqDto;
                export type EthGetBalanceResDto = string;

                /**
                 * eth-获取用户交易数
                 * GET /wallet/eth/trans/count
                 * WALLET_ETH_API_REQUEST.GET_TRANS_COUNT
                 */
                export type EthGetTransCountReqDto = EthBaseReqDto;
                export type EthGetTransCountResDto = number;

                /**
                 * eth-交易前需要的预备信息
                 * POST /wallet/eth/trans/prep
                 * WALLET_ETH_API_REQUEST.TRANS_PREP
                 */
                export interface EthTransPrepReqDto {
                    from: string;
                    to: string;
                    amount: string;
                    type: number;
                    contractAddress?: string;
                }
                export interface EthTransPrepResDto {
                    address: string;
                    type: number;
                    gasPrice: string;
                    txCount: number;
                    generalGas: number;
                    contractGas: number;
                }

                /**
                 * eth-获取用户合约余额信息
                 * GET /wallet/eth/balance/bep20
                 * WALLET_ETH_API_REQUEST.GET_CONTRACT_BALANCE
                 */
                export interface Erc20BalanceReqDto {
                    /**用户地址 */
                    address: string;
                    /**合约地址 */
                    contractAddress: string;
                }
                export type Erc20BalanceResDto = {
                    /**合约余额 */
                    balance: string;
                    /**合约精度 */
                    decimal: number;
                };

                /**
                 * eth-获取合约交易的data
                 * POST /wallet/eth/bep20/data
                 * WALLET_ETH_API_REQUEST.GET_CONTRACT_DATA
                 */
                export type Erc20TransDataReqDto = {
                    from: string;
                    to: string;
                    amount: string;
                    contractAddress: string;
                };
                export type Erc20TransDataResDto = string;

                /**
                 * eth-发送已签名的交易
                 * POST /wallet/eth/trans/send
                 * WALLET_ETH_API_REQUEST.TRANS_SEND
                 */
                export interface EthSendSignTransReqDto {
                    /**已签名的交易字符串 */
                    signTransData: string;
                    /**交易详情 */
                    detail: ExternalChain.ExternalTransDetail;
                }
                export type EthSendSignTransResDto = string;

                /**
                 * eth-查询指定地址的普通交易历史
                 * POST /wallet/eth/trans/normal/history
                 * WALLET_ETH_API_REQUEST.GET_NORMAL_HISTORY
                 */
                export type EthTransHistoryReqDto = BFChainWallet.ETH.TransHistoryReq;
                export type EthTransHistoryResDto = BFChainWallet.ETH.NormalTransHistoryRes;

                /**
                 * eth-查询指定地址的合约交易历史
                 * POST /wallet/eth/trans/bep20/history
                 * WALLET_ETH_API_REQUEST.GET_CONTRACT_HISTORY
                 */
                export type Erc20TransHistoryReqDto = EthTransHistoryReqDto;
                export type Erc20TransHistoryResDto = BFChainWallet.ETH.Erc20TransHistoryRes;

                /**
                 * eth-查询合约代币列表(只提供ERC20协议的代币)
                 * POST /wallet/eth/contract/tokens
                 * WALLET_ETH_API_REQUEST.GET_CONTRACT_TOKENS
                 */
                export interface TokenInfoListReqDto extends PageRequest {
                    /**归属链 */
                    chain: ExternalChainName;
                    /**搜索关键字 */
                    keywords: string;
                    /**合约地址 */
                    contractAddress: string;
                }
                export interface TokenInfoListResDto {
                    page: number;
                    pageSize: number;
                    total: number;
                    pages: number;
                    data: ContractTokenInfo.ContractTokenInfo[];
                }

                /**
                 * eth-查询合约代币详情
                 * POST /wallet/eth/contract/token/detail
                 * WALLET_ETH_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL
                 */
                export interface TokenInfoDetailReqDto {
                    /**归属链 */
                    chain: CHAIN_ID;
                    /**合约标识 */
                    symbol: string;
                }
                export type TokenInfoDetailResDto = ContractTokenInfo.ContractTokenInfo | null;

                /**
                 * eth-查询账户余额V2
                 * POST /wallet/eth/account/balance/v2
                 * WALLET_ETH_API_REQUEST.GET_BALANCE_V2
                 */
                export interface EthAccountBalanceV2ReqDto {
                    /**用户地址 */
                    address: string;
                    /**合约地址列表 */
                    contracts: string[];
                }
                export type EthAccountBalanceV2ResDto = ERC20BalanceItem[];

                /**
                 * eth-查询pending状态交易
                 * POST /wallet/eth/trans/pending
                 * WALLET_ETH_API_REQUEST.TRANS_PENDING
                 */
                export interface EthPendingTransReqDto {
                    /**用户地址 */
                    address: string;
                    /**资产标识 */
                    assetSymbol: string;
                }
                export type EthPendingTransResDto = ExternalChain.TransactionBase[];

                /**
                 * eth-交易基础信息查询
                 * POST /wallet/eth/trans/query
                 * WALLET_ETH_API_REQUEST.TRANS_QUERY
                 */
                export interface EthQueryTransReqDto {
                    /**交易哈希 */
                    txHash: string;
                }
                export type EthQueryTransResDto = BFChainWallet.ETH.TransactionCustom;

                /**
                 * eth-对交易数据进行签名(仅测试环境使用)
                 * POST /wallet/eth/trans/sign
                 * WALLET_ETH_API_REQUEST.TRANS_SIGN
                 */
                export type EthSignTransactionReqDto = BFChainWallet.ETH.SignTransactionReq;
                export type EthSignTransactionResDto = BFChainWallet.ETH.SignTransactionRes;

                /**
                 * eth-普通交易测试(仅测试环境使用)
                 * POST /wallet/eth/trans/create
                 * WALLET_ETH_API_REQUEST.TRANS_CREATE
                 * WALLET_ETH_API_REQUEST.TRANS_ERC20_CREATE
                 */
                export type EthCreateTransReqDto = {
                    from: string;
                    to: string;
                    amount: string;
                    assetSymbol: string;
                    contract: string;
                    privateKey: string;
                };
                export type EthCreateTransResDto = string;

                /**
                 * eth-直接广播
                 * POST /wallet/eth/broadcast/direct
                 * WALLET_ETH_API_REQUEST.BROADCAST_DIRECT
                 */
                export type EthBrocastDirectReqDto = {
                    /**已签名的交易字符串 */
                    signTransData: string;
                };
                export type EthBrocastDirectResDto = string;
            }

            /**Eth合约账户信息 */
            export class ERC20BalanceItem {
                contractAddress: string;
                amount: string;
                decimals: number;
                symbol: string;
                icon: string;
            }
        }

        export namespace Bsc {
            export namespace Api {
                /**
                 * bsc-基础请求
                 */
                export type BscBaseReqDto = Eth.Api.EthBaseReqDto;

                /**
                 * bsc-获取最新区块
                 * GET /wallet/bsc/block
                 * WALLET_BSC_API_REQUEST.GET_LAST_BLOCK
                 */
                export type BscGetLastBlockResDto = Eth.Api.EthGetLastBlockResDto;

                /**
                 * bsc-获取区块
                 * GET /wallet/bsc/block/query
                 * WALLET_BSC_API_REQUEST.GET_BLOCK
                 */
                export type BscGetBlockReqDto = Eth.Api.EthGetBlockReqDto;
                export type BscGetBlockResDto = Eth.Api.EthGetBlockResDto;

                /**
                 * bsc-获取chainId
                 * GET /wallet/bsc/getChainId
                 * WALLET_BSC_API_REQUEST.GET_CHAIN_ID
                 */
                export type BscGetChainIdResDto = Eth.Api.EthGetChainIdResDto;

                /**
                 * 获取基础Gas信息
                 * GET /wallet/bsc/baseGas
                 * WALLET_BSC_API_REQUEST.GET_BASE_GAS
                 */
                export type BscGetBaseGasResDto = Eth.Api.EthGetBaseGasResDto;

                /**
                 * bsc-获取GasPrice信息
                 * GET /wallet/bsc/gasPrice
                 * WALLET_BSC_API_REQUEST.GET_GAS_PRICE
                 */
                export type BscGetGasPriceResDto = Eth.Api.EthGetGasPriceResDto;

                /**
                 * bsc-获取用户余额信息
                 * GET /wallet/bsc/balance
                 * WALLET_BSC_API_REQUEST.GET_BALANCE
                 */
                export type BscGetBalanceReqDto = BscBaseReqDto;
                export type BscGetBalanceResDto = Eth.Api.EthGetBalanceResDto;

                /**
                 * bsc-获取用户交易数
                 * GET /wallet/bsc/trans/count
                 * WALLET_BSC_API_REQUEST.GET_TRANS_COUNT
                 */
                export type BscGetTransCountReqDto = BscBaseReqDto;
                export type BscGetTransCountResDto = Eth.Api.EthGetTransCountResDto;

                /**
                 * bsc-交易前需要的预备信息
                 * POST /wallet/bsc/trans/prep
                 * WALLET_BSC_API_REQUEST.TRANS_PREP
                 */
                export type BscTransPrepReqDto = Eth.Api.EthTransPrepReqDto;
                export type BscTransPrepResDto = Eth.Api.EthTransPrepResDto;

                /**
                 * bsc-获取用户合约余额信息
                 * GET /wallet/bsc/balance/bep20
                 * WALLET_BSC_API_REQUEST.GET_CONTRACT_BALANCE
                 */
                export type Bep20BalanceReqDto = Eth.Api.Erc20BalanceReqDto;
                export type Bep20BalanceResDto = Eth.Api.Erc20BalanceResDto;

                /**
                 * bsc-获取合约交易的data
                 * POST /wallet/bsc/bep20/data
                 * WALLET_BSC_API_REQUEST.GET_CONTRACT_DATA
                 */
                export type Bep20TransDataReqDto = Eth.Api.Erc20TransDataReqDto;
                export type Bep20TransDataResDto = Eth.Api.Erc20TransDataResDto;
                /**
                 * bsc-发送已签名的交易
                 * POST /wallet/bsc/trans/send
                 * WALLET_BSC_API_REQUEST.TRANS_SEND
                 */
                export type BscSendSignTransReqDto = Eth.Api.EthSendSignTransReqDto;
                export type BscSendSignTransResDto = Eth.Api.EthSendSignTransResDto;

                /**
                 * bsc-查询指定地址的普通交易历史
                 * POST /wallet/bsc/trans/normal/history
                 * WALLET_BSC_API_REQUEST.GET_NORMAL_HISTORY
                 */
                export type BscTransHistoryReqDto = Eth.Api.EthTransHistoryReqDto;
                export type BscTransHistoryResDto = Eth.Api.EthTransHistoryResDto;

                /**
                 * bsc-查询指定地址的合约交易历史
                 * POST /wallet/bsc/trans/bep20/history
                 * WALLET_BSC_API_REQUEST.GET_CONTRACT_HISTORY
                 */
                export type Bep20TransHistoryReqDto = BscTransHistoryReqDto;
                export type Bep20TransHistoryResDto = Eth.Api.Erc20TransHistoryResDto;

                /**
                 * bsc-查询合约代币列表(只提供ERC20协议的代币)
                 * POST /wallet/bsc/contract/tokens
                 * WALLET_BSC_API_REQUEST.GET_CONTRACT_TOKENS
                 */
                export type TokenInfoListReqDto = Eth.Api.TokenInfoListReqDto;
                export type TokenInfoListResDto = Eth.Api.TokenInfoListResDto;

                /**
                 * bsc-查询合约代币详情
                 * POST /wallet/bsc/contract/token/detail
                 * WALLET_BSC_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL
                 */
                export type TokenInfoDetailReqDto = Eth.Api.TokenInfoDetailReqDto;
                export type TokenInfoDetailResDto = Eth.Api.TokenInfoDetailResDto;

                /**
                 * bsc-查询账户余额V2
                 * POST /wallet/bsc/account/balance/v2
                 * WALLET_BSC_API_REQUEST.GET_BALANCE_V2
                 */
                export type BscAccountBalanceV2ReqDto = Eth.Api.EthAccountBalanceV2ReqDto;
                export type BscAccountBalanceV2ResDto = Eth.Api.EthAccountBalanceV2ResDto;

                /**
                 * bsc-查询pending状态交易
                 * POST /wallet/bsc/trans/pending
                 * WALLET_BSC_API_REQUEST.TRANS_PENDING
                 */
                export type BscPendingTransReqDto = Eth.Api.EthPendingTransReqDto;
                export type BscPendingTransResDto = Eth.Api.EthPendingTransResDto;

                /**
                 * bsc-交易基础信息查询
                 * POST /wallet/bsc/trans/query
                 * WALLET_BSC_API_REQUEST.TRANS_QUERY
                 */
                export type BscQueryTransReqDto = Eth.Api.EthQueryTransReqDto;
                export type BscQueryTransResDto = Eth.Api.EthQueryTransResDto;

                /**
                 * bsc-对交易数据进行签名(仅测试环境使用)
                 * POST /wallet/bsc/trans/sign
                 * WALLET_BSC_API_REQUEST.TRANS_SIGN
                 */
                export type BscSignTransactionReqDto = Eth.Api.EthSignTransactionReqDto;
                export type BscSignTransactionResDto = Eth.Api.EthSignTransactionResDto;

                /**
                 * bsc-普通交易测试(仅测试环境使用)
                 * POST /wallet/bsc/trans/create
                 * WALLET_BSC_API_REQUEST.TRANS_CREATE
                 * WALLET_BSC_API_REQUEST.TRANS_ERC20_CREATE
                 */
                export type BscCreateTransReqDto = Eth.Api.EthCreateTransReqDto;
                export type BscCreateTransResDto = Eth.Api.EthCreateTransResDto;

                /**
                 * bsc-直接广播
                 * POST /wallet/bsc/broadcast/direct
                 * WALLET_BSC_API_REQUEST.BROADCAST_DIRECT
                 */
                export type BscBrocastDirectReqDto = Eth.Api.EthBrocastDirectReqDto;
                export type BscBrocastDirectResDto = Eth.Api.EthBrocastDirectResDto;
            }
        }

        export namespace Tron {
            export namespace Api {
                /**
                 * tron-基础请求
                 */
                export type TronBaseReqDto = Eth.Api.EthBaseReqDto;

                /**
                 * tron-查询余额
                 */
                export interface TronBalanceReqDto {
                    /**用户地址 */
                    owner_address: string;
                    /**合约地址 */
                    contract_address: string;
                    /**账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址 */
                    visible?: boolean;
                    /**用户的hex地址，visible为true时，必须要有 */
                    hex_address?: string;
                    /**交易详情 */
                    asset?: {
                        name: string;
                        decimal: number;
                    };
                }
                export interface TronBalanceResDto {
                    /**用户地址 */
                    owner_address: string;
                    /**合约地址 */
                    contract_address: string;
                    /**合约余额 */
                    balance: number;
                    /**合约代币精度(只有余额不为0时显示) */
                    decimal: number;
                }

                /**
                 * tron-获取用户合约信息
                 */
                export interface Trc20ContractReqDto {
                    /**用户地址 */
                    address: string;
                    /**合约地址 */
                    contract: string;
                }
                export interface Trc20ContractResDto {
                    /**合约余额 */
                    balance: string;
                    /**合约精度 */
                    decimal: number;
                }

                /**
                 * tron-获取最新区块信息
                 * GET /wallet/tron/nowBlock
                 * WALLET_TRON_API_REQUEST.GET_LAST_BLOCK
                 */
                export type TronGetLastBlockResDto = TronBlockData;

                /**
                 * tron-获取用户余额
                 * GET /wallet/tron/balance
                 * WALLET_TRON_API_REQUEST.GET_BALANCE
                 */
                export type TronGetBalanceReqDto = TronBaseReqDto;
                export type TronGetBalanceResDto = string;

                /**
                 * tron-获取账户信息
                 * GET /wallet/tron/account
                 * WALLET_TRON_API_REQUEST.GET_ACCOUNT
                 */
                export type TronGetAccountReqDto = TronBaseReqDto;
                export interface TronGetAccountResDto {
                    /**账户是否激活 */
                    active: boolean;
                    /**账户具体信息(账户未激活时，此字段不返回) */
                    account?: {
                        /** 账户地址，Base58check */
                        address: string;
                        /** 账户地址，HEX格式  */
                        addressHex: string;
                        /** 账户余额, 比例 1000000:1 */
                        balance: number;
                    };
                }

                /**
                 * tron-获取账户资源信息
                 * GET /wallet/tron/account/resource
                 * WALLET_TRON_API_REQUEST.GET_ACCOUNT_RESOURCE
                 */
                export type TronGetAccountResourceReqDto = TronBaseReqDto;
                export type TronGetAccountResourceResDto = BFChainWallet.TRON.TronAccountResources;

                /**
                 * tron-获取指定合约代币余额
                 * GET /wallet/tron/balance/trc20
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE
                 */
                export type Trc20BalanceReqDto = TronBalanceReqDto;
                export type Trc20BalanceResDto = number;

                /**
                 * tron-获取指定合约代币余额V2
                 * GET /wallet/tron/balance/trc20/v2
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_V2
                 */
                export type Trc20BalanceV2ReqDto = Trc20ContractReqDto;
                export type Trc20BalanceV2ResDto = string;

                /**
                 * tron-获取指定合约代币精度
                 * GET /wallet/tron/decimal/trc20
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_DECIMAL
                 */
                export type Trc20DecimalReqDto = TronBalanceReqDto;
                export type Trc20DecimalResDto = number;

                /**
                 * tron-获取指定合约代币精度V2
                 * GET /wallet/tron/decimal/trc20/v2
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_DECIMAL_V2
                 */
                export type Trc20DecimalV2ReqDto = Trc20ContractReqDto;
                export type Trc20DecimalV2ResDto = number;

                /**
                 * tron-获取合约余额和精度
                 * GET /wallet/tron/contract/balance
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_AND_DECIMAL
                 */
                export type Trc20BalanceAndDecimalReqDto = TronBalanceReqDto;
                export type Trc20BalanceAndDecimalResDto = TronBalanceResDto;

                /**
                 * tron-获取合约余额和精度V2
                 * GET /wallet/tron/contract/balance/v2
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_AND_DECIMAL_V2
                 */
                export type Trc20BalanceAndDecimalV2ReqDto = Trc20ContractReqDto;
                export type Trc20BalanceAndDecimalV2ResDto = Trc20ContractResDto;

                /**
                 * tron-创建TRX普通交易
                 * GET /wallet/tron/trans/create
                 * WALLET_TRON_API_REQUEST.CREATE_NORMAL_TRANS
                 */
                export type TronCreateNormalTransReqDto = BFChainWallet.TRON.CreateTransactionReq;
                export type TronCreateNormalTransResDto = BFChainWallet.TRON.TronTransaction;

                /**
                 * tron-创建TRX普通交易V2
                 * GET /wallet/tron/send/trx
                 * WALLET_TRON_API_REQUEST.CREATE_NORMAL_TRANS_V2
                 */
                export type TronCreateNormalTransV2ReqDto = BFChainWallet.TRON.SendTrxReq;
                export type TronCreateNormalTransV2ResDto = BFChainWallet.TRON.TronTransaction;

                /**
                 * tron-创建TRC20交易
                 * GET /wallet/tron/trans/contract
                 * WALLET_TRON_API_REQUEST.CREATE_CONTRACT_TRANS
                 */
                export type TronCreateContractTransReqDto = BFChainWallet.TRON.TriggerSmartContractReq;
                export type TronCreateContractTransResDto = BFChainWallet.TRON.TriggerSmartContractRes;

                /**
                 * tron-创建TRC20交易V2
                 * GET /wallet/tron/send/trc20
                 * WALLET_TRON_API_REQUEST.CREATE_CONTRACT_TRANS_V2
                 */
                export type TronCreateContractTransV2ReqDto = BFChainWallet.TRON.SendTrc20Req;
                export type TronCreateContractTransV2ResDto = BFChainWallet.TRON.Trc20Transaction;

                /**
                 * tron-普通转账交易广播
                 * GET /wallet/tron/trans/broadcast
                 * WALLET_TRON_API_REQUEST.BROADCAST_NORMAL_TRANS
                 */
                export type TronBroadcastNormalTransReqDto = BFChainWallet.TRON.TronTransaction;
                export type TronBroadcastNormalTransResDto = BFChainWallet.TRON.BroadcastTransactionRes;

                /**
                 * tron-TRC20交易广播
                 * GET /wallet/tron/trans/trc20/broadcast
                 * WALLET_TRON_API_REQUEST.BROADCAST_CONTRACT_TRANS
                 */
                export type TronBroadcastContractTransReqDto = BFChainWallet.TRON.Trc20Transaction;
                export type TronBroadcastContractTransResDto = BFChainWallet.TRON.BroadcastTransactionRes;

                /**
                 * tron-查询指定地址的普通交易历史
                 * POST /wallet/tron/trans/common/history
                 * WALLET_TRON_API_REQUEST.GET_NORMAL_HISTORY
                 */
                export type TronTransHistoryReqDto = BFChainWallet.TRON.TronTransHistoryReq;
                export type TronTransHistoryResDto = any;

                /**
                 * tron-查询指定地址的合约交易历史
                 * POST /wallet/tron/trans/trc20/history
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_HISTORY
                 */
                export type Trc20TransHistoryReqDto = TronTransHistoryReqDto;
                export type Trc20TransHistoryResDto = any;

                /**
                 * tron-查询合约代币列表(只提供TRC20协议的代币)
                 * POST /wallet/tron/contract/tokens
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_TOKENS
                 */
                export type TokenInfoListReqDto = Eth.Api.TokenInfoListReqDto;
                export type TokenInfoListResDto = Eth.Api.TokenInfoListResDto;

                /**
                 * tron-查询合约代币详情
                 * POST /wallet/tron/contract/token/detail
                 * WALLET_TRON_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL
                 */
                export type TokenInfoDetailReqDto = Eth.Api.TokenInfoDetailReqDto;
                export type TokenInfoDetailResDto = Eth.Api.TokenInfoDetailResDto;

                /**
                 * tron-查询账户余额V2
                 * POST /wallet/tron/account/balance/v2
                 * WALLET_TRON_API_REQUEST.GET_BALANCE_V2
                 */
                export type TronAccountBalanceV2ReqDto = Eth.Api.EthAccountBalanceV2ReqDto;
                export type TronAccountBalanceV2ResDto = Eth.Api.EthAccountBalanceV2ResDto;

                /**
                 * tron-查询pending状态交易
                 * POST /wallet/tron/trans/pending
                 * WALLET_TRON_API_REQUEST.TRANS_PENDING
                 */
                export type TronPendingTransReqDto = Eth.Api.EthPendingTransReqDto;
                export type TronPendingTransResDto = Eth.Api.EthPendingTransResDto;

                /**
                 * tron-查询已完成交易详情
                 * POST /wallet/tron/trans/receipt
                 * WALLET_TRON_API_REQUEST.TRANS_RECEIPT
                 */
                export interface TronReceiptTransReqDto {
                    /**交易ID */
                    txId: string;
                }
                export type TronReceiptTransResDto = BFChainWallet.TRON.TronTransactionInfo;

                /**
                 * tron-直接广播
                 * POST /wallet/tron/broadcast/direct
                 * WALLET_TRON_API_REQUEST.BROADCAST_DIRECT
                 */
                export type TronBrocastDirectReqDto = TronBroadcastContractTransReqDto;
                export type TronBrocastDirectResDto = string;
            }

            /**tron区块数据 */
            export interface TronBlockData {
                /**区块ID */
                blockID: string;
                /**区块高度 */
                number: number;
            }
        }
    }
}
