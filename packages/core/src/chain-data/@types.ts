import { ExternalChainName, InternalChainName } from "@bnqkl/wallet-typings";

export {};
declare global {
    export namespace WalletCore {
        export namespace ChainData {
            export namespace Api {
                /**
                 * 批量获取资产信息
                 * POST /wallet/chainData/multiGetAssetInfo
                 * WALLET_CHAIN_DATA_API_REQUEST.MULTI_GET_ASSET_INFO
                 */
                export interface MultiGetAssetInfoReqDto {
                    /**资产查询参数 */
                    queryParams: (ExternalAssetQueryParam | InternalAssetQueryParam)[];
                }
                export type MultiGetAssetInfoResDto = AssetInfo[];
            }

            /**外链资产查询参数 */
            export interface ExternalAssetQueryParam {
                /**链名 */
                chainName: ExternalChainName;
                /**地址 */
                address: string;
                /**合约地址 */
                contractAddress?: string;
            }

            /**内链资产查询参数 */
            export interface InternalAssetQueryParam {
                /**链名 */
                chainName: InternalChainName;
                /**地址 */
                address: string;
                /**资产类型 */
                assetType: string;
            }

            /**资产信息 */
            export interface AssetInfo {
                /**链名 */
                chainName: ExternalChainName | InternalChainName;
                /**地址 */
                address: string;
                /**余额 */
                amount: string;
                /**精度 */
                decimals: number;
                /**资产类型 */
                assetType: string;
                /**头像地址 */
                icon?: string;
            }
        }
    }
}
