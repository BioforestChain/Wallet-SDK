import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { forwardRef, Inject } from "@nestjs/common";
import { ExternalChainTransMgr } from "../external-chain-trans/external-chain-trans-mgr.js";
import { InternalChainTransMgr } from "../internal-chain-trans/internal-chain-trans-mgr.js";
import { ExternalAssetQueryParam, InternalAssetQueryParam, MultiGetAssetInfoReqDto } from "./dto.js";
import { $asyncAllNoNullMap } from "@bnqkl/server-util";
import { BCF_DEFAULT_DECIMALS, ChainHelper, ExternalChainName, InternalChainName } from "@bnqkl/wallet-typings";
import { WALLET_CHAIN_DATA_API_REQUEST } from "@bnqkl/wallet-core";

@ApiTags("CHAIN-DATA")
@Controller()
export class ChainDataController {
    @Inject(forwardRef(() => ExternalChainTransMgr))
    private __externalChainTransMgr!: ExternalChainTransMgr;
    @Inject(forwardRef(() => InternalChainTransMgr))
    private __internalChainTransMgr!: InternalChainTransMgr;

    @Post(WALLET_CHAIN_DATA_API_REQUEST.MULTI_GET_ASSET_INFO)
    @ApiOperation({ summary: "批量获取资产信息", description: "WALLET_CHAIN_DATA_API_REQUEST.MULTI_GET_ASSET_INFO" })
    async multiGetAssetInfo(@Body() dto: MultiGetAssetInfoReqDto): Promise<WalletCore.ChainData.Api.MultiGetAssetInfoResDto> {
        return await $asyncAllNoNullMap(dto.queryParams, async (queryParam) => {
            const { chainName, address } = queryParam;
            if (chainName in ExternalChainName) {
                const { contractAddress } = queryParam as ExternalAssetQueryParam;
                const transactionService = this.__externalChainTransMgr.getTransactionService(chainName as ExternalChainName);
                if (contractAddress) {
                    const { amount, decimals, symbol, icon } = (await transactionService.getAccountBalanceV2({ address, contracts: [contractAddress] }))[0];
                    const info: WalletCore.ChainData.AssetInfo = {
                        chainName,
                        address,
                        amount,
                        decimals,
                        assetType: symbol,
                        icon,
                    };
                    return info;
                }
                const balance = await transactionService.getBalance(address);
                const info: WalletCore.ChainData.AssetInfo = {
                    chainName,
                    address,
                    amount: balance,
                    decimals: ChainHelper.getExternalMainAssetDecimal(chainName as ExternalChainName),
                    assetType: ChainHelper.getExternalMainAssetType(chainName as ExternalChainName),
                };
                return info;
            }
            const { assetType } = queryParam as InternalAssetQueryParam;
            const transactionService = this.__internalChainTransMgr.getTransactionService(chainName as InternalChainName);
            const result = await transactionService.getAddressBalance({ address, assetType });
            if (!result.success) {
                throw Error(`address:${address} getAddressBalance fail`);
            }
            const info: WalletCore.ChainData.AssetInfo = {
                chainName,
                address,
                amount: result.result.amount,
                decimals: BCF_DEFAULT_DECIMALS,
                assetType,
            };
            return info;
        });
    }
}
