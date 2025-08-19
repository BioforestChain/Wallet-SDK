import type { InternalAssetType, InternalChainName, InternalTransStateID } from "./constants.js";

export {};
declare global {
    export namespace WalletTypings {
        export namespace InternalChain {
            export namespace Api {
                /**
                 * 获取内链最新区块
                 * GET /wallet/internalChain/getLastBlock
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.GET_LAST_BLOCK
                 */
                export interface GetInternalLastBlockReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                }
                export interface GetInternalLastBlockResDto extends BFMetaNodeSDK.Basic.GetLastBlockResult {}

                /**
                 * 获取内链区块
                 * GET /wallet/internalChain/getBlock
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.GET_BLOCK
                 */
                export interface GetInternalBlockReqDto extends BFMetaNodeSDK.Basic.GetBlockParams {
                    /**链名 */
                    chainName: InternalChainName;
                }
                export interface GetInternalBlockResDto extends BFMetaNodeSDK.Basic.GetBlockResult {}

                /**
                 * 生成权益转移交易
                 * POST /wallet/internalChain/createTransferAsset
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ASSET
                 */
                export interface CreateInternalTransferAssetReqDto extends CreateTrBaseParamWithRecipientId {
                    /**资产类型 */
                    assetType: string;
                    /**转账数量 */
                    amount: string;
                }
                export interface CreateInternalTransferAssetResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成发行权益交易
                 * POST /wallet/internalChain/createIssueAsset
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ASSET
                 */
                export interface CreateInternalIssueAssetReqDto extends CreateTrBaseParamWithRecipientId {
                    /**发行的权益信息 */
                    assetInfo: TransactionMaker.Transaction.IssueAssetTransactionParams["assetInfo"];
                }
                export interface CreateInternalIssueAssetResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成增发权益交易
                 * POST /wallet/internalChain/createIncreaseAsset
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_INCREASE_ASSET
                 */
                export interface CreateInternalIncreaseAssetReqDto extends CreateTrBaseParamWithRecipientId {
                    /**增发的权益信息 */
                    assetInfo: TransactionMaker.Transaction.IncreaseAssetTransactionParams["assetInfo"];
                    /**冻结的主权益数量，0-9 组成并且不包含小数点 */
                    frozenMainAssetPrealnum?: string;
                }
                export interface CreateInternalIncreaseAssetResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成销毁权益交易
                 * POST /wallet/internalChain/createDestroyAsset
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_DESTROY_ASSET
                 */
                export interface CreateInternalDestroyAssetReqDto extends CreateTrBaseParamWithRecipientId {
                    /**销毁的权益信息 */
                    assetInfo: TransactionMaker.Transaction.DestroyAssetTransactionParams["assetInfo"];
                }
                export interface CreateInternalDestroyAssetResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成质押权益交易
                 * POST /wallet/internalChain/createStakeAsset
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_STAKE_ASSET
                 */
                export interface CreateInternalStakeAssetReqDto extends CreateTrBaseParam {
                    /**质押的权益信息 */
                    assetInfo: TransactionMaker.Transaction.StakeAssetTransactionParams["assetInfo"];
                    /**质押的唯一索引：1-30 个字符，小写字母 + 数字 */
                    stakeId: string;
                    /**质押的权益开始接质押的区块间隔，0-9 组成并且不包含小数点 */
                    numberOfUnstakeHeight: number;
                }
                export interface CreateInternalStakeAssetResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成解除质押权益交易
                 * POST /wallet/internalChain/createUnstakeAsset
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_UNSTAKE_ASSET
                 */
                export interface CreateInternalUnstakeAssetReqDto extends CreateTrBaseParam {
                    /**质押的权益信息 */
                    assetInfo: TransactionMaker.Transaction.UnstakeAssetTransactionParams["assetInfo"];
                    /**质押的唯一索引：1-30 个字符，小写字母 + 数字 */
                    stakeId: string;
                }
                export interface CreateInternalUnstakeAssetResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成发行非同质资产模板交易
                 * POST /wallet/internalChain/createIssueEntityFactory
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_FACTORY
                 */
                export interface CreateIssueEntityFactoryReqDto extends CreateTrBaseParamWithRecipientId {
                    /**发行的非同质资产模板信息 */
                    issueFactoryInfo: TransactionMaker.Transaction.IssueEntityFactoryTransactionParams["factoryInfo"];
                }
                export interface CreateIssueEntityFactoryResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成发行非同质资产交易
                 * POST /wallet/internalChain/createIssueEntity
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY
                 */
                export interface CreateIssueEntityReqDto extends CreateTrBaseParamWithRecipientId {
                    /**发行的非同质资产信息 */
                    issueEntityInfo: TransactionMaker.Transaction.IssueEntityTransactionParams["entityInfo"];
                }
                export interface CreateIssueEntityResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成批量发行非同质资产交易
                 * POST /wallet/internalChain/createIssueEntityMulti
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_MULTI
                 */
                export interface CreateIssueEntityMultiReqDto extends CreateTrBaseParamWithRecipientId {
                    /**发行的非同质资产信息 */
                    issueEntityInfo: TransactionMaker.Transaction.IssueEntityMultiTransactionParams["entityInfo"];
                }
                export interface CreateIssueEntityMultiResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成转移资产交易
                 * POST /wallet/internalChain/createTransferEntity
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ENTITY
                 */
                export interface CreateTransferEntityReqDto extends CreateTrBaseParamWithRecipientId {
                    /**转移资产id */
                    entityId: string;
                    /**纳税信息 */
                    taxInformation?: TransactionMaker.Transaction.TaxInformationJson;
                }
                export interface CreateTransferEntityResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 保存内链交易
                 * POST /wallet/internalChain/saveTransaction
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION
                 */
                export interface SaveInternalTransactionReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**交易体 */
                    transactionJSON: BFMetaNodeSDK.Basic.TransactionJSON;
                    /**业务参数 */
                    param?: Entity.BusinessParam;
                }
                export interface SaveInternalTransactionResDto {
                    /**交易id */
                    txId: string;
                }

                /**
                 * 生成内链交易逻辑对象
                 * POST /wallet/internalChain/createTransObj
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ
                 */
                export interface CreateInternalTransObjReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**交易id */
                    txId: string;
                }

                /**
                 * 获取内链交易
                 * GET /wallet/internalChain/getTrans
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.GET_TRANS
                 */
                export interface GetInternalTransReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**交易id */
                    txId: string;
                }
                export type GetInternalTransResDto = TransactionBase;

                /**
                 * 获取内链账户余额
                 * GET /wallet/internalChain/getAccountBalance
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE
                 */
                export interface GetInternalAccountBalanceReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**用户地址 */
                    address: string;
                    /**资产类型 */
                    assetType: string;
                }
                export interface GetInternalAccountBalanceResDto {
                    amount: string;
                }

                /**
                 * 更新内链交易状态
                 * POST /wallet/internalChain/updateTransState
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE
                 */
                export interface UpdateInternalTransStateReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**交易id */
                    txId: string;
                    /**交易状态 */
                    state: InternalTransStateID;
                }
                export type UpdateInternalTransStateResDto = boolean;

                /**
                 * 获取链的资产信息
                 * POST /wallet/internalChain/accounts/balance
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ALL_ACOUNT_BALANCE
                 */
                export interface GetInternalAccountsBalanceReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**过滤条件 */
                    filter: BFChainWallet.BCF.GetAllAccountAssetReq;
                }
                export interface GetInternalAccountsBalanceResDto extends BFChainWallet.BCF.GetAllAccountAssetResp {}

                /**
                 * 生成内链投票交易
                 * POST /wallet/internalChain/createVoteTr
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_VOTE_TR
                 */
                export interface CreateVoteTrReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**交易参数 */
                    data: TransactionMaker.Transaction.VoteTransactionParams;
                }
                export interface CreateVoteTrResDto {
                    /**交易体 */
                    tr: TransactionMaker.TransactionJSON<any>;
                }

                /**
                 * 上传文件
                 * POST /wallet/internalChain/uploadFile
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILE
                 */
                export interface UploadFileReqDto {
                    /**上传的文件 */
                    file: any;
                }
                export interface UploadFileResDto {
                    /**上传文件在链上的url */
                    blobUrl: string;
                }

                /**
                 * 批量上传文件
                 * POST /wallet/internalChain/uploadFiles
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILES
                 */
                export interface UploadFilesReqDto {
                    /**上传的文件 */
                    files: any[];
                }
                export interface UploadFilesResDto {
                    /**上传文件在链上的url */
                    blobUrls: string[];
                }

                /**
                 * 下载文件
                 * GET /wallet/internalChain/downloadFile
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.DOWNLOAD_FILE
                 */
                export interface DownloadFileReqDto {
                    /**下载文件在链上的url */
                    blobUrl: string;
                }

                /**
                 * 获取内链交易
                 * GET /wallet/internalChain/getAssetDetails
                 * WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ASSET_DETAILS
                 */
                export interface GetAssetDetailsReqDto {
                    /**链名 */
                    chainName: InternalChainName;
                    /**资产类型 */
                    assetType: string;
                }
                export interface GetAssetDetailsResDto {
                    amount: string;
                }
            }

            /**创建内链交易基础参数 */
            export interface CreateTrBaseParam {
                /**链名 */
                chainName: InternalChainName;
                /**发送者私钥 */
                secret: string;
                /**业务参数 */
                param?: Entity.BusinessParam;
                /**安全密码 */
                secondSecretInfo?: {
                    secondSecret: string;
                    useOld: boolean;
                };
                /**事件备注信息 */
                remark?: {
                    [key: string]: string;
                };
                /**手续费 */
                fee?: string;
            }
            export interface CreateTrBaseParamWithRecipientId extends CreateTrBaseParam {
                /**接收者地址 */
                recipientId: string;
            }

            export interface TransactionBase extends Entity.ChainTransEntity<InternalTransStateID, InternalChainName, BFMetaNodeSDK.Basic.TransactionJSON> {
                /** 交易类型 */
                type: string;
                /** 发送者地址 */
                senderId: string;
                /** 接受者地址 */
                recipientId?: string;
                /** 交易签名 */
                signature: string;
                /** 事件创建时间戳 */
                createTimestamp: number;
                /** 事件发起高度 */
                applyBlockHeight: number;
                /** 事件失效高度 */
                effectiveBlockHeight: number;
                /** 上链高度时间戳 */
                onChainTimestamp: number;
                /** 成功确认高度 */
                successHeight: number;
                /** 失败确认高度 */
                failHeight: number;
                /** 重试广播次数 */
                retryBroadcastNum: number;
            }

            /**内链交易详情 */
            export interface TransDetail {
                /**链名 */
                chainName: InternalChainName;
                /**发送地址 */
                from: string;
                /**接收地址 */
                to: string;
                /**交易数量 */
                amount: string;
                /**资产类型 */
                assetType: string;
                /**交易Hash */
                txHash: string;
            }

            /**交易手续费信息 */
            export interface TransFeeInfo {
                /**交易手续费 */
                fee: string;
            }

            export type TransferAssetTransaction = BFMetaNodeSDK.Common.TransactionJSON<{
                transferAsset: {
                    amount: string;
                    assetType: string;
                };
            }> & { recipientId: string };

            export type DestroyAssetAsset = {
                destroyAsset: {
                    amount: string;
                    assetType: string;
                };
            };
            export type DestroyAssetTransaction = BFMetaNodeSDK.Common.TransactionJSON<DestroyAssetAsset> & { recipientId: string };

            /**发起方交易体 */
            export interface FromTrJson {
                /**生物链林 */
                bcf?: {
                    /**内链名 */
                    chainName: InternalChainName;
                    /**交易体数据 */
                    trJson: TransferAssetTransaction;
                };
            }

            /**发起方交易体 */
            export interface FromTrJsonCommon<T extends {}, M extends {}> {
                /**生物链林 */
                bcf?: {
                    /**内链名 */
                    chainName: InternalChainName;
                    /**交易体数据 */
                    trJson: BFMetaNodeSDK.Common.TransactionJSON<T> & M;
                };
            }

            /**接收方交易信息 */
            export interface ToTrInfo {
                /**内链名 */
                chainName: InternalChainName;
                /**内链地址 */
                address: string;
                /**内链货币类型 */
                assetType: InternalAssetType;
            }

            /**接收方交易详情 */
            export interface ToTrDetail extends ToTrInfo {}
        }

        export namespace Bcf {
            export namespace Api {
                /**
                 * 获取最新区块
                 * WALLET_BCF_API_REQUEST.GET_LAST_BLOCK
                 */
                export type BcfGetLastBlockResDto = BFMetaNodeSDK.Basic.GetLastBlockResult;

                /**
                 * 获取最新区块高度
                 * WALLET_BCF_API_REQUEST.GET_LAST_BLOCK_HEIGHT
                 */
                export type BcfGetLastBlockHeightResDto = number;

                /**
                 * 查询区块
                 * WALLET_BCF_API_REQUEST.QUERY_BLOCK
                 */
                export type BcfQueryBlockReqDto = BFMetaNodeSDK.Basic.GetBlockParams;
                export type BcfQueryBlockResDto = BFMetaNodeSDK.Basic.GetBlockResult;

                /**
                 * 查询链上交易
                 * WALLET_BCF_API_REQUEST.QUERY_TRANSACTION
                 */
                export type BcfQueryTransactionReqDto = BFMetaNodeSDK.Basic.GetTransactionsParams;
                export type BcfQueryTransactionResDto = BFMetaNodeSDK.Basic.GetTransactionsResult;

                /**
                 * 广播事件
                 * WALLET_BCF_API_REQUEST.BROADCAST_TRANSACTION
                 */
                export type BcfBroadcastTransactionReqDto = BFMetaNodeSDK.Basic.TransactionJSON;
                export type BcfBroadcastTransactionResDto = BFMetaNodeSDK.Basic.TransactionJSON;

                /**
                 * 广播事件-通知
                 * WALLET_BCF_API_REQUEST.BROADCAST_TRANSACTION_NOTIFY
                 */
                export type BcfBroadcastTransactionNotifyReqDto = {
                    customParamString?: string; // 自定义参数
                    notifyUrl: string; // url
                    toAddress: string; // 接收地址
                    fromAddress: string; // 发送地址
                    amount: string; // 发送数量
                    timestamp: number; // 时间戳，用于签名用
                    signature: string; /// 内链对整个 json签名
                    publickey: string; /// 签名对应公钥
                    trsInfo: {
                        chain: InternalChainName; // 链名
                        info: {
                            assetType: string;
                            trs: WalletTypings.Bcf.Api.BcfBroadcastTransactionReqDto; // 内链确保转账交易，assetType跟传进来的一样,接收地址跟发送地址跟传进来的相匹配
                            trsId: string; //交易id，交易id判断该交易体没上链过（避免拿以前上链交易进来）
                        };
                    };
                };
                export type BcfBroadcastTransactionNotifyResDto = BFMetaNodeSDK.Basic.TransactionJSON;
                /**
                 * 创建转账事件
                 * WALLET_BCF_API_REQUEST.CREATE_TRANSFER_ASSET
                 */
                export type BcfCreateTransferAssetReqDto = BFMetaNodeSDK.Transaction.TransferAssetTransactionParams;
                export type BcfCreateTransferAssetResDto = BFMetaNodeSDK.Transaction.SuccessCreateResult["result"];

                /**
                 * 创建转账事件(安全密钥)
                 * WALLET_BCF_API_REQUEST.PACKAGE_TRANSFER_ASSET
                 */
                export type BcfPackageTransferAssetReqDto = BFMetaNodeSDK.Transaction.PackageTransacationParams;
                export type BcfPackageTransferAssetResDto = BFMetaNodeSDK.Transaction.SuccessPackageResult["result"];

                /**
                 * 广播转账事件
                 * WALLET_BCF_API_REQUEST.BROADCAST_TRANSFER_ASSET
                 */
                export type BcfBroadcastTransferAssetReqDto = BFMetaNodeSDK.Transaction.BroadcastTransacationParams;
                export type BcfBroadcastTransferAssetResDto = BFMetaNodeSDK.Basic.TransactionJSON;

                /**
                 * 创建交易密码事件
                 * WALLET_BCF_API_REQUEST.CREATE_SIGNATURE
                 */
                export type BcfCreateSignatureReqDto = BFMetaNodeSDK.Transaction.SignatureTransactionParams;
                export type BcfCreateSignatureResDto = BFMetaNodeSDK.Transaction.SuccessCreateResult["result"];

                /**
                 * 创建交易密码事件(安全密钥)
                 * WALLET_BCF_API_REQUEST.PACKAGE_SIGNATURE
                 */
                export type BcfPackageSignatureReqDto = BFMetaNodeSDK.Transaction.PackageTransacationParams;
                export type BcfPackageSignatureResDto = BFMetaNodeSDK.Transaction.SuccessPackageResult["result"];

                /**
                 * 广播交易密码事件
                 * WALLET_BCF_API_REQUEST.BROADCAST_SIGNATURE
                 */
                export type BcfBroadcastSignatureReqDto = BFMetaNodeSDK.Transaction.BroadcastTransacationParams;
                export type BcfBroadcastSignatureResDto = BFMetaNodeSDK.Basic.TransactionJSON;

                /**
                 * 获取地址余额
                 * WALLET_BCF_API_REQUEST.GET_ADDRESS_BALANCE
                 */
                export interface BcfGetAddressBalanceReqDto {
                    /**地址 */
                    address: string;
                    /**资产类型 */
                    assetType: string;
                }
                export type BcfGetAddressBalanceResDto = BFChainWallet.BCF.GetAddressBalanceResp;

                /**
                 * 获取地址相关信息
                 * WALLET_BCF_API_REQUEST.GET_ADDRESS_INFO
                 */
                export interface BcfGetAddressInfoReqDto {
                    /**地址 */
                    address: string;
                }
                export type BcfGetAddressInfoResDto = BFChainWallet.BCF.GetAccountInfoResp;

                /**
                 * 获取近一轮区块平均手续费
                 * WALLET_BCF_API_REQUEST.GET_BLOCK_AVE_FEE
                 */
                export type BcfGetBlockAveFeeResDto = BFChainWallet.BCF.GetBlockAverageFeeResp;

                /**
                 * 获取pending状态的交易
                 * WALLET_BCF_API_REQUEST.GET_PENDING_TR
                 */
                export interface BcfGetPendingTrReqDto {
                    /**发起者地址 */
                    senderId?: string;
                    /**"1为正序 -1 为逆序" */
                    sort?: 1 | -1;
                }
                export type BcfGetPendingTrResDto = InternalChain.TransactionBase[];

                /**
                 * 获取地址资产信息
                 * WALLET_BCF_API_REQUEST.GET_ADDRESS_ASSET
                 */
                export type BcfGetAddressAssetReqDto = BFMetaNodeSDK.Basic.GetTransactionsParams;
                export type BcfGetAddressAssetResDto = BFChainWallet.BCF.GetAccountAssetResp;

                /**
                 * 获取代币资产列表
                 * WALLET_BCF_API_REQUEST.GET_ASSETS
                 */
                export interface BcfGetAssetsReqDto extends PageRequest {
                    /**查询资产名称(模糊匹配) */
                    assetType?: string;
                }
                export type BcfGetAssetsResDto = BFChainWallet.BCF.GetAssetsResp;

                /**
                 * 获取代币资产详情
                 * WALLET_BCF_API_REQUEST.GET_ASSET_DETAILS
                 */
                export interface BcfGetAssetDetailsReqDto {
                    /**资产标识 */
                    assetType: string;
                }
                export type BcfGetAssetDetailsResDto = BFChainWallet.BCF.GetAssetDetailsResp;

                /**
                 * 每字节最小手续费
                 * WALLET_BCF_API_REQUEST.GET_MIN_PER_BYTE
                 */
                export type BcfGetMinPerByteResDto = BFMetaNodeSDK.Basic.GetTransactionMinFeePerByteResult;
            }
        }
    }
}
