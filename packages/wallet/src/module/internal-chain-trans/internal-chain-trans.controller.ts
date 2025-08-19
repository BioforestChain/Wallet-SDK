import { Body, Controller, Get, Post, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InternalChainTransMgr } from "./internal-chain-trans-mgr.js";
import { forwardRef, Inject } from "@nestjs/common";
import {
    CreateInternalDestroyAssetReqDto,
    CreateInternalIncreaseAssetReqDto,
    CreateInternalIssueAssetReqDto,
    CreateInternalStakeAssetReqDto,
    CreateInternalTransferAssetReqDto,
    CreateInternalTransObjReqDto,
    CreateInternalUnstakeAssetReqDto,
    CreateIssueEntityFactoryReqDto,
    CreateIssueEntityMultiReqDto,
    CreateIssueEntityReqDto,
    CreateTransferEntityReqDto,
    CreateVoteTrReqDto,
    DownloadFileReqDto,
    GetInternalAssetDetailsReqDto,
    GetInternalAccountBalanceReqDto,
    GetInternalAccountsBalanceReqDto,
    GetInternalBlockReqDto,
    GetInternalLastBlockReqDto,
    GetInternalTransReqDto,
    SaveInternalTransactionReqDto,
    UpdateInternalTransStateReqDto,
    UploadFileReqDto,
    UploadFilesReqDto,
} from "./dto.js";
import { FileHelper } from "../../helper.js";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Throttle } from "@nestjs/throttler";
import { Response } from "express";
import { $noNullMap, Logger, WALLET_INTERNAL_CHAIN_API_REQUEST } from "@bnqkl/wallet-sdk";

@ApiTags("INTERNAL-CHAIN")
@Controller()
export class InternalChainTransController {
    @Inject(forwardRef(() => InternalChainTransMgr))
    private __internalChainTransMgr!: InternalChainTransMgr;

    @Get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_LAST_BLOCK)
    @ApiOperation({ summary: "获取内链最新区块", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.GET_LAST_BLOCK" })
    async getLastBlock(@Query() dto: GetInternalLastBlockReqDto): Promise<WalletTypings.InternalChain.Api.GetInternalLastBlockResDto> {
        const transactionService = this.__internalChainTransMgr.getTransactionService(dto.chainName);
        const resp = await transactionService.getLastBlock();
        if (!resp.success) {
            throw resp;
        }
        return resp.result;
    }

    @Get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_BLOCK)
    @ApiOperation({ summary: "获取内链区块", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.GET_BLOCK" })
    async getBlock(@Query() dto: GetInternalBlockReqDto): Promise<WalletTypings.InternalChain.Api.GetInternalBlockResDto> {
        const transactionService = this.__internalChainTransMgr.getTransactionService(dto.chainName);
        const resp = await transactionService.getBlock(dto);
        if (!resp.success) {
            throw resp;
        }
        return resp.result;
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER)
    @ApiOperation({ summary: "生成内链转账交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER" })
    createTransfer(@Body() dto: CreateInternalTransferAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalTransferAssetResDto> {
        return this.__internalChainTransMgr.createTransferAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ASSET)
    @ApiOperation({ summary: "生成权益转移交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ASSET" })
    createTransferAsset(@Body() dto: CreateInternalTransferAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalTransferAssetResDto> {
        return this.__internalChainTransMgr.createTransferAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ASSET)
    @ApiOperation({ summary: "生成发行权益交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ASSET" })
    createIssueAsset(@Body() dto: CreateInternalIssueAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalIssueAssetResDto> {
        return this.__internalChainTransMgr.createIssueAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_INCREASE_ASSET)
    @ApiOperation({ summary: "生成增发权益交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_INCREASE_ASSET" })
    createIncreaseAsset(@Body() dto: CreateInternalIncreaseAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalIncreaseAssetResDto> {
        return this.__internalChainTransMgr.createIncreaseAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_DESTROY_ASSET)
    @ApiOperation({ summary: "生成销毁权益交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_DESTROY_ASSET" })
    createDestroyAsset(@Body() dto: CreateInternalDestroyAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalDestroyAssetResDto> {
        return this.__internalChainTransMgr.createDestroyAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_STAKE_ASSET)
    @ApiOperation({ summary: "生成质押权益交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_STAKE_ASSET" })
    createStakeAsset(@Body() dto: CreateInternalStakeAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalStakeAssetResDto> {
        return this.__internalChainTransMgr.createStakeAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_UNSTAKE_ASSET)
    @ApiOperation({ summary: "生成解除质押权益交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_UNSTAKE_ASSET" })
    createUnstakeAsset(@Body() dto: CreateInternalUnstakeAssetReqDto): Promise<WalletTypings.InternalChain.Api.CreateInternalUnstakeAssetResDto> {
        return this.__internalChainTransMgr.createUnstakeAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_FACTORY)
    @ApiOperation({ summary: "生成发行非同质资产模板交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_FACTORY" })
    createIssueEntityFactory(@Body() dto: CreateIssueEntityFactoryReqDto): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityFactoryResDto> {
        return this.__internalChainTransMgr.createIssueEntityFactory(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY)
    @ApiOperation({ summary: "生成发行非同质资产交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY" })
    createIssueEntity(@Body() dto: CreateIssueEntityReqDto): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityResDto> {
        return this.__internalChainTransMgr.createIssueEntity(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_MULTI)
    @ApiOperation({ summary: "生成批量发行非同质资产交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_MULTI" })
    createIssueEntityMulti(@Body() dto: CreateIssueEntityMultiReqDto): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityMultiResDto> {
        return this.__internalChainTransMgr.createIssueEntityMulti(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ENTITY)
    @ApiOperation({ summary: "生成转移资产交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ENTITY" })
    createTransferEntity(@Body() dto: CreateTransferEntityReqDto): Promise<WalletTypings.InternalChain.Api.CreateTransferEntityResDto> {
        return this.__internalChainTransMgr.createTransferEntity(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.SAVE_TRANSFER)
    @ApiOperation({ summary: "保存内链转账交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.SAVE_TRANSFER" })
    saveTransfer(@Body() dto: SaveInternalTransactionReqDto): Promise<WalletTypings.InternalChain.Api.SaveInternalTransactionResDto> {
        return this.__internalChainTransMgr.saveTransaction(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION)
    @ApiOperation({ summary: "保存内链交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION" })
    saveTransaction(@Body() dto: SaveInternalTransactionReqDto): Promise<WalletTypings.InternalChain.Api.SaveInternalTransactionResDto> {
        return this.__internalChainTransMgr.saveTransaction(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ)
    @ApiOperation({ summary: "生成内链交易逻辑对象", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ" })
    createTransObj(@Body() dto: CreateInternalTransObjReqDto): Promise<void> {
        return this.__internalChainTransMgr.createTransObj(dto);
    }

    @Get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_TRANS)
    @ApiOperation({ summary: "获取内链交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.GET_TRANS" })
    getTrans(@Query() dto: GetInternalTransReqDto): Promise<WalletTypings.InternalChain.Api.GetInternalTransResDto> {
        return this.__internalChainTransMgr.getTrans(dto);
    }

    @Get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE)
    @ApiOperation({ summary: "获取内链账户余额", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE" })
    getAccountBalance(@Query() dto: GetInternalAccountBalanceReqDto): Promise<WalletTypings.InternalChain.Api.GetInternalAccountBalanceResDto> {
        return this.__internalChainTransMgr.getAccountBalance(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE)
    @ApiOperation({ summary: "更新内链交易状态", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE" })
    updateTransState(@Body() dto: UpdateInternalTransStateReqDto): Promise<WalletTypings.InternalChain.Api.UpdateInternalTransStateResDto> {
        return this.__internalChainTransMgr.updateTransState(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ALL_ACOUNT_BALANCE)
    @ApiOperation({ summary: "获取链的资产信息", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ALL_ACOUNT_BALANCE" })
    getAllAccountAsset(@Body() dto: GetInternalAccountsBalanceReqDto): Promise<BFChainWallet.BCF.GetAllAccountAssetResp> {
        return this.__internalChainTransMgr.getAllAccountAsset(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_VOTE_TR)
    @ApiOperation({ summary: "生成内链投票交易", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_VOTE_TR" })
    createVoteTr(@Body() dto: CreateVoteTrReqDto): Promise<WalletTypings.InternalChain.Api.CreateVoteTrResDto> {
        return this.__internalChainTransMgr.createVoteTr(dto);
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILE)
    @ApiOperation({ summary: "上传文件", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILE" })
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: UploadFileReqDto })
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<WalletTypings.InternalChain.Api.UploadFileResDto> {
        return { blobUrl: FileHelper.saveBlobFile(file) };
    }

    @Post(WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILES)
    @ApiOperation({ summary: "批量上传文件", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILES" })
    @UseInterceptors(FileFieldsInterceptor([{ name: "files" }]))
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: UploadFilesReqDto })
    async uploadFiles(@UploadedFiles() { files }: { files: Express.Multer.File[] }): Promise<WalletTypings.InternalChain.Api.UploadFilesResDto> {
        return { blobUrls: $noNullMap(files, (file) => FileHelper.saveBlobFile(file)) };
    }

    @Throttle({ getImage: { limit: 1, ttl: 1 } })
    @Get(WALLET_INTERNAL_CHAIN_API_REQUEST.DOWNLOAD_FILE)
    @ApiOperation({ summary: "下载文件", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.DOWNLOAD_FILE" })
    async downloadFile(@Query() dto: DownloadFileReqDto, @Res() response: Response): Promise<void> {
        const { blobUrl } = dto;
        const match = blobUrl.match(/\/\/([^\?]+)/);
        if (!match || !match[1]) {
            throw Error(`asset image url format exception`);
        }
        const hash = match[1];
        const imagePath = FileHelper.getBlobPath(hash);
        response.setHeader("Content-type", "image/*");
        response.sendFile(imagePath);
    }

    @Get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ASSET_DETAILS)
    @ApiOperation({ summary: "获取内链资产详情", description: "WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ASSET_DETAILS" })
    getAssetDetails(@Query() dto: GetInternalAssetDetailsReqDto): Promise<BFChainWallet.BCF.GetAssetDetailsResp> {
        return this.__internalChainTransMgr.getAssetDetails(dto);
    }
}
