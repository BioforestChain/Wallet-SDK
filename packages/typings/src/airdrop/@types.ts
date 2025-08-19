import { AIRDROP_ORDER_STATE_ID, AIRDROP_RECORD_STATE, AIRDROP_TYPE, DP_FILE_TYPE, DP_LEVEL } from "./constants.js";
import { InternalChainName } from "../internal-chain.js";

export {};
declare global {
    export namespace WalletTypings {
        export namespace Airdrop {
            /**为了方便客户端，Api命名空间下只包含各Dto的接口和注释，相当于对接文档 */
            export namespace Api {
                /**
                 * 空投
                 * POST /wallet/airdrop
                 * WALLET_AIRDROP_API_REQUEST.AIRDROP
                 */
                export interface AirdropReqDto {
                    /**空投链名 */
                    chainName: InternalChainName;
                    /**空投类型 */
                    airdropType: AIRDROP_TYPE;
                    /**dp发行信息 */
                    issueDpInfo: IssueDpInfo;
                    /**dp转移信息 */
                    transferDpInfos: TransferDpInfo[];
                    /**空投完成后通知的消息队列id */
                    mqId?: string;
                    /**上传的文件 */
                    file?: any;
                }
                export interface AirdropResDto {
                    /**空投订单id */
                    orderId: string;
                }

                /**
                 * 空投订单重试发行交易上链
                 * POST /wallet/airdrop/retryIssueTxOnChain
                 * WALLET_AIRDROP_API_REQUEST.RETRY_ISSUE_TX_ONCHAIN
                 */
                export interface AirdropRetryIssueTxOnChainReqDto {
                    /**订单id */
                    orderId: string;
                }
                export type AirdropRetryIssueTxOnChainResDto = boolean;

                /**
                 * 空投订单重试转移交易上链
                 * POST /wallet/airdrop/retryTransferTxOnChain
                 * WALLET_AIRDROP_API_REQUEST.RETRY_TRANSFER_TX_ONCHAIN
                 */
                export interface AirdropRetryTransferTxOnChainReqDto {
                    /**订单id */
                    orderId: string;
                }
                export type AirdropRetryToTransferOnChainResDto = boolean;

                /**
                 * 获取空投记录列表
                 * GET /wallet/airdrop/records
                 * WALLET_AIRDROP_API_REQUEST.RECORDS
                 */
                export interface AirdropRecordsReqDto extends PageRequest {
                    /**空投链名 */
                    chainName?: InternalChainName;
                    /**空投地址 */
                    address?: string;
                    /**空投类型 */
                    airdropType?: AIRDROP_TYPE;
                }
                export type AirdropRecordsResDto = BasePageData<AirdropRecord>;

                /**
                 * 获取空投记录详情
                 * GET /wallet/airdrop/recordDetail
                 * WALLET_AIRDROP_API_REQUEST.RECORD_DETAIL
                 */
                export interface AirdropRecordDetailReqDto {
                    /**订单id */
                    orderId: string;
                }
                export interface AirdropRecordDetailResDto extends Order.RecordDetail<AIRDROP_RECORD_STATE, AIRDROP_ORDER_STATE_ID> {
                    /**发行交易信息 */
                    issueTxInfo: Order.RecordDetailTxInfo;
                    /**转移交易信息 */
                    transferTxInfos: Order.RecordDetailTxInfo[];
                }
            }

            /**dp发行信息 */
            export interface IssueDpInfo {
                remark: DpRemark;
                /**dp专辑信息 */
                factoryInfo: DpEntityFactoryInfo;
                /**限量集dp集合内总数 */
                quantity?: number;
            }

            /**dp专辑信息 */
            export interface DpEntityFactoryInfo {
                /**非同质资产流通需要缴纳的版税 */
                taxAssetPrealnum?: string;
                /**非同质资产模板的拥有者 */
                entityFactoryPossessor: string;
                /**非同质资产的模板 */
                entityFactory: {
                    /**非同质资产模板 */
                    factoryId: string;
                    /**允许发行的非同质资产数量 */
                    entityPrealnum: string;
                    /**发行非同质资产时冻结的主权益数量，销毁时解冻 */
                    entityFrozenAssetPrealnum: string;
                    /**购买模板使用全的主权益数量 */
                    purchaseAssetPrealnum: string;
                };
            }

            /**dp的Remark */
            export interface DpRemark {
                from: string;
                type: string;
                version: string;
                data: {
                    name: string;
                    fileType: DP_FILE_TYPE;
                    level: DP_LEVEL;
                    links: string;
                    description: string;
                };
                pic: string;
            }

            /**dp转移信息 */
            export interface TransferDpInfo {
                address: string;
                /**限量集dp编号 */
                dpNo?: number;
            }

            /**空投记录 */
            export interface AirdropRecord extends Order.Record<AIRDROP_RECORD_STATE, AIRDROP_ORDER_STATE_ID> {
                /**链名 */
                chainName: InternalChainName;
                /**发行交易id  */
                issueTxId: string;
                /**转移交易id  */
                transferTxIds: string[];
            }
        }
    }
}
