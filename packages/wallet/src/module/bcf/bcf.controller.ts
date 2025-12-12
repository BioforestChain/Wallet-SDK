import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
    BFChainV2Service,
    BfmChainService,
    BIWMetaService,
    BTCMetaService,
    BTGMetaService,
    CcchainService,
    ETHMetaService,
    PMChainService,
} from "./bcf.service";
import { InternalChainTransService } from "../internal-chain-trans/internal-chain-trans.service";
import {
    BFChainBlockDto,
    BcfQueryBlockReqDto,
    BFChainTransInBlockDto,
    BcfQueryTransactionReqDto,
    BcfBroadcastTransactionReqDto,
    BcfCommonResponseTransDto,
    BcfCreateTransferAssetReqDto,
    BcfCommonPackageTransDto,
    BcfCommonBroadcastTransDto,
    BcfCreateSignatureReqDto,
    BcfGetAddressBalanceReqDto,
    GetAccountInfoResDto,
    BcfGetAddressInfoReqDto,
    BcfGetPendingTrReqDto,
    BcfGetAssetsReqDto,
    MinperByteResDto,
    BcfGetAssetDetailsReqDto,
    BcfBroadcastTransactionNotifyReqDto,
} from "./dto";
import { ChainHelper, InternalChainName, WALLET_BCF_API_REQUEST } from "@bnqkl/wallet-sdk";

/**
 * 生物链林相关链的控制器
 */
@Controller()
export abstract class BCFController {
    abstract service: InternalChainTransService;

    @Get(WALLET_BCF_API_REQUEST.GET_LAST_BLOCK)
    @ApiOperation({ summary: "获取最新区块", description: "WALLET_BCF_API_REQUEST.GET_LAST_BLOCK" })
    getlastblock(): Promise<WalletTypings.Bcf.Api.BcfGetLastBlockResDto> {
        return this.service.getLastBlock() as any;
    }

    @Get(WALLET_BCF_API_REQUEST.GET_LAST_BLOCK_HEIGHT)
    @ApiOperation({ summary: "获取最新区块高度", description: "WALLET_BCF_API_REQUEST.GET_LAST_BLOCK_HEIGHT" })
    getlastblockHeight(): Promise<WalletTypings.Bcf.Api.BcfGetLastBlockHeightResDto> {
        return this.service.getRemoteLastBlockHeight();
    }

    @Post(WALLET_BCF_API_REQUEST.QUERY_BLOCK)
    @ApiOperation({ summary: "查询区块", description: "WALLET_BCF_API_REQUEST.QUERY_BLOCK" })
    @ApiOkResponse({ type: BFChainBlockDto })
    getBlock(@Body() getBlockDto: BcfQueryBlockReqDto): Promise<WalletTypings.Bcf.Api.BcfQueryBlockResDto> {
        return this.service.getBlock(getBlockDto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.QUERY_TRANSACTION)
    @ApiOperation({ summary: "查询链上交易", description: "WALLET_BCF_API_REQUEST.QUERY_TRANSACTION" })
    @ApiOkResponse({ type: BFChainTransInBlockDto })
    getTransactions(@Body() getTransactionsDto: BcfQueryTransactionReqDto): Promise<WalletTypings.Bcf.Api.BcfQueryTransactionResDto> {
        return this.service.getTransactions(getTransactionsDto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.BROADCAST_TRANSACTION)
    @ApiOperation({ summary: "广播事件", description: "WALLET_BCF_API_REQUEST.BROADCAST_TRANSACTION" })
    broadcastTransaction(@Body() transaction: BcfBroadcastTransactionReqDto): Promise<WalletTypings.Bcf.Api.BcfBroadcastTransactionResDto> {
        return this.service.broadcastTransaction(transaction) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.BROADCAST_TRANSACTION_NOTIFY)
    @ApiOperation({ summary: "广播事件", description: "WALLET_BCF_API_REQUEST.BROADCAST_TRANSACTION_NOTIFY" })
    broadcastTransactionNotify(@Body() dto: BcfBroadcastTransactionNotifyReqDto): Promise<WalletTypings.Bcf.Api.BcfBroadcastTransactionResDto> {
        return this.service.broadcastTransactionNotify(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.CREATE_TRANSFER_ASSET)
    @ApiOperation({ summary: "创建转账事件", description: "WALLET_BCF_API_REQUEST.CREATE_TRANSFER_ASSET" })
    @ApiOkResponse({ type: BcfCommonResponseTransDto })
    createTransferAsset(@Body() dto: BcfCreateTransferAssetReqDto): Promise<WalletTypings.Bcf.Api.BcfCreateTransferAssetResDto> {
        return this.service.sdkCreateTransferAsset(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.PACKAGE_TRANSFER_ASSET)
    @ApiOperation({ summary: "创建转账事件(安全密钥)", description: "WALLET_BCF_API_REQUEST.PACKAGE_TRANSFER_ASSET" })
    @ApiOkResponse({ type: BcfCommonResponseTransDto })
    packageTransferAsset(@Body() dto: BcfCommonPackageTransDto): Promise<WalletTypings.Bcf.Api.BcfPackageTransferAssetResDto> {
        return this.service.sdkPackageTransferAsset(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.BROADCAST_TRANSFER_ASSET)
    @ApiOperation({ summary: "广播转账事件", description: "WALLET_BCF_API_REQUEST.BROADCAST_TRANSFER_ASSET" })
    broadcastTransferAsset(@Body() dto: BcfCommonBroadcastTransDto): Promise<WalletTypings.Bcf.Api.BcfBroadcastTransferAssetResDto> {
        return this.service.broadcastTransferAsset(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.CREATE_SIGNATURE)
    @ApiOperation({ summary: "创建交易密码事件", description: "WALLET_BCF_API_REQUEST.CREATE_SIGNATURE" })
    @ApiOkResponse({ type: BcfCommonResponseTransDto })
    createSignature(@Body() dto: BcfCreateSignatureReqDto): Promise<WalletTypings.Bcf.Api.BcfCreateSignatureResDto> {
        return this.service.sdkCreateSignature(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.PACKAGE_SIGNATURE)
    @ApiOperation({ summary: "创建交易密码事件(安全密钥)", description: "WALLET_BCF_API_REQUEST.PACKAGE_SIGNATURE" })
    @ApiOkResponse({ type: BcfCommonResponseTransDto })
    packageSignature(@Body() dto: BcfCommonPackageTransDto): Promise<WalletTypings.Bcf.Api.BcfPackageSignatureResDto> {
        return this.service.sdkPackageSignature(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.BROADCAST_SIGNATURE)
    @ApiOperation({ summary: "广播交易密码事件", description: "WALLET_BCF_API_REQUEST.BROADCAST_SIGNATURE" })
    broadcastSignature(@Body() dto: BcfCommonBroadcastTransDto): Promise<WalletTypings.Bcf.Api.BcfBroadcastSignatureResDto> {
        return this.service.broadcastSignature(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.GET_ADDRESS_BALANCE)
    @ApiOperation({ summary: "获取地址余额", description: "WALLET_BCF_API_REQUEST.GET_ADDRESS_BALANCE" })
    getAddressBalance(@Body() dto: BcfGetAddressBalanceReqDto): Promise<WalletTypings.Bcf.Api.BcfGetAddressBalanceResDto> {
        return this.service.getAddressBalance(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.GET_ADDRESS_INFO)
    @ApiOperation({ summary: "获取地址相关信息", description: "WALLET_BCF_API_REQUEST.GET_ADDRESS_INFO" })
    @ApiOkResponse({ type: GetAccountInfoResDto })
    getAccountInfo(@Body() dto: BcfGetAddressInfoReqDto): Promise<WalletTypings.Bcf.Api.BcfGetAddressInfoResDto> {
        return this.service.getAccountInfo(dto.address) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.GET_BLOCK_AVE_FEE)
    @ApiOperation({ summary: "获取近一轮区块平均手续费", description: "WALLET_BCF_API_REQUEST.GET_BLOCK_AVE_FEE" })
    getBlockAverageFee(): Promise<WalletTypings.Bcf.Api.BcfGetBlockAveFeeResDto> {
        return this.service.getBlockAverageFee() as any;
    }

    @Post(WALLET_BCF_API_REQUEST.GET_PENDING_TR)
    @ApiOperation({ summary: "获取pending状态的交易", description: "WALLET_BCF_API_REQUEST.GET_PENDING_TR" })
    getPendingTransaction(@Body() dto: BcfGetPendingTrReqDto): Promise<WalletTypings.Bcf.Api.BcfGetPendingTrResDto> {
        return this.service.getPendingTransaction(dto);
    }

    @Post(WALLET_BCF_API_REQUEST.GET_ADDRESS_ASSET)
    @ApiOperation({ summary: "获取地址资产信息", description: "WALLET_BCF_API_REQUEST.GET_ADDRESS_ASSET" })
    getAccountAsset(@Body() dto: BcfGetAddressInfoReqDto): Promise<WalletTypings.Bcf.Api.BcfGetAddressAssetResDto> {
        return this.service.getAccountAsset(dto.address) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.GET_ASSETS)
    @ApiOperation({ summary: "获取代币资产列表", description: "WALLET_BCF_API_REQUEST.GET_ASSETS" })
    getAssets(@Body() dto: BcfGetAssetsReqDto): Promise<WalletTypings.Bcf.Api.BcfGetAssetsResDto> {
        return this.service.getAssets(dto) as any;
    }

    @Post(WALLET_BCF_API_REQUEST.GET_ASSET_DETAILS)
    @ApiOperation({ summary: "获取代币资产详情", description: "WALLET_BCF_API_REQUEST.GET_ASSET_DETAILS" })
    getAssetDetails(@Body() dto: BcfGetAssetDetailsReqDto): Promise<WalletTypings.Bcf.Api.BcfGetAssetDetailsResDto> {
        return this.service.getAssetDetails(dto.assetType) as any;
    }

    @Get(WALLET_BCF_API_REQUEST.GET_MIN_PER_BYTE)
    @ApiOperation({ summary: "每字节最小手续费", description: "WALLET_BCF_API_REQUEST.GET_MIN_PER_BYTE" })
    @ApiOkResponse({ type: MinperByteResDto })
    getMinFeePerByte(): Promise<WalletTypings.Bcf.Api.BcfGetMinPerByteResDto> {
        return this.service.getTransactionMinFeePerByte() as any;
    }
}

@ApiTags(InternalChainName.BFMCHAIN)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.BFMCHAIN))
export class BfmChainController extends BCFController {
    @Inject(BfmChainService)
    public readonly service: BfmChainService;
}

@ApiTags(InternalChainName.BFCHAINV2)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.BFCHAINV2))
export class BFChainV2Controller extends BCFController {
    @Inject(BFChainV2Service)
    public readonly service: BFChainV2Service;
}

@ApiTags(InternalChainName.CCCHAIN)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.CCCHAIN))
export class CcchainController extends BCFController {
    @Inject(CcchainService)
    public readonly service: CcchainService;
}

@ApiTags(InternalChainName.PMCHAIN)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.PMCHAIN))
export class PMChainController extends BCFController {
    @Inject(PMChainService)
    public readonly service: PMChainService;
}

@ApiTags(InternalChainName.ETHMETA)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.ETHMETA))
export class ETHMetaController extends BCFController {
    @Inject(ETHMetaService)
    public readonly service: ETHMetaService;
}

@ApiTags(InternalChainName.BTCMETA)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.BTCMETA))
export class BTCMetaController extends BCFController {
    @Inject(BTCMetaService)
    public readonly service: BTCMetaService;
}

@ApiTags(InternalChainName.BTGMETA)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.BTGMETA))
export class BTGMetaController extends BCFController {
    @Inject(BTGMetaService)
    public readonly service: BTGMetaService;
}

@ApiTags(InternalChainName.BIWMETA)
@Controller(ChainHelper.getBcfPathPrefix(InternalChainName.BIWMETA))
export class BIWMetaController extends BCFController {
    @Inject(BIWMetaService)
    public readonly service: BIWMetaService;
}
