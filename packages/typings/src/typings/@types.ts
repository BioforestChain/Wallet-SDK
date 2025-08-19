import { ExternalChainName } from "../external-chain.js";
import { InternalChainName } from "../internal-chain.js";

export {};
declare global {
    export namespace WalletTypings {
        export type DeepPartial<T> = {
            [P in keyof T]?: DeepPartial<T[P]>;
        };

        export interface BasePageData<T> {
            page: number;
            pageSize: number;
            dataList: T[];
        }

        export interface PageData<T> extends BasePageData<T> {
            total: number;
            hasMore: boolean;
            skip: number;
        }

        export interface PageDataConstructor {
            new <T>(page: number, pageSize: number, dataList: T[], total: number, hasMore: boolean, skip: number): PageData<T>;
        }

        /**按页获取结果的请求 */
        export interface PageRequest {
            /**页序号 */
            page: number;
            /**页大小 */
            pageSize: number;
        }

        export type Fraction = {
            /**分子 */
            numerator: string | number;
            /**分母*/
            denominator: string | number;
        };

        export namespace Entity {
            export interface BaseEntity {
                id: number;
                createdTime: Date;
                updatedTime: Date;
            }
            export interface BaseEntityWithUuId extends BaseEntity {
                /** 唯一id */
                entityId: string;
            }

            export interface FSMEntity<StateID extends number> extends BaseEntityWithUuId {
                /** 状态 */
                state: StateID;
                /** 逻辑删除 */
                delFlag: number;
            }

            /**链上交易Entity */
            export interface ChainTransEntity<TransStateID extends number, ChainName extends string, TrJsonType extends object = {}>
                extends FSMEntity<TransStateID> {
                /**链名 */
                chainName: ChainName;
                /**交易体 */
                trJson: TrJsonType;
                /**失败原因 */
                failReason?: string;
                /**消息队列id */
                mqId?: string;
                /**关联业务表类型 */
                linkType?: number;
                /**关联业务表编号 */
                linkId?: string;
            }

            /**交易业务参数 */
            export interface BusinessParam {
                /**消息队列id */
                mqId: string;
                /**关联业务表类型 */
                linkType: number;
                /**关联业务表编号 */
                linkId: string;
            }
        }

        /**交易手续费信息 */
        export type TransFeeInfo = ExternalChain.TransFeeInfo | InternalChain.TransFeeInfo;

        export namespace Order {
            /**订单记录 */
            export interface Record<RecordState, OrderStateID> {
                /**订单id */
                orderId: string;
                /**记录状态 */
                state: RecordState;
                /**订单状态 */
                orderState: OrderStateID;
                /**发起方交易信息 */
                fromTxInfo?: RecordTxInfo;
                /**接收方交易信息 */
                toTxInfo?: RecordTxInfo;
                /**交易创建时间 */
                createdTime: Date;
            }

            /**订单记录交易信息 */
            export interface RecordTxInfo {
                /**链名 */
                chainName: ExternalChainName | InternalChainName;
                /**资产数量 */
                amount: string;
                /**资产类型 */
                asset: string;
                /**资产精度 */
                decimals: number;
                /**资产logo地址 */
                assetLogoUrl?: string;
            }

            /**订单记录详情 */
            export interface RecordDetail<RecordState, OrderStateID> {
                /**记录状态 */
                state: RecordState;
                /**订单状态 */
                orderState: OrderStateID;
                /**发起方交易信息 */
                fromTxInfo?: RecordDetailTxInfo;
                /**接收方交易信息 */
                toTxInfo?: RecordDetailTxInfo;
                /**订单失败原因 */
                orderFailReason?: string;
                /**更新时间 */
                updatedTime: Date;
            }

            /**订单记录详情交易信息 */
            export interface RecordDetailTxInfo {
                /**链名 */
                chainName: ExternalChainName | InternalChainName;
                /**地址 */
                address: string;
                /**交易id */
                txId?: string;
                /**交易hash */
                txHash?: string;
                /**合约地址 */
                contractAddress?: string;
                /**上链手续费信息 */
                feeInfo?: WalletTypings.TransFeeInfo;
            }
        }
    }
}
