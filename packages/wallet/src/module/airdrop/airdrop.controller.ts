import { Body, Controller, forwardRef, Get, Inject, Post, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AirdropRecordDetailReqDto, AirdropRecordsReqDto, AirdropReqDto, AirdropRetryIssueTxOnChainReqDto, AirdropRetryTransferTxOnChainReqDto } from "./dto.js";
import { AirdropService } from "./airdrop.service.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { Logger, WALLET_AIRDROP_API_REQUEST } from "@bnqkl/wallet-sdk";

@ApiTags("AIRDROP")
@Controller()
export class AirdropController {
    @Inject(forwardRef(() => AirdropService))
    private __airdropService!: AirdropService;

    @Post(WALLET_AIRDROP_API_REQUEST.AIRDROP)
    @ApiOperation({ summary: "空投", description: "WALLET_AIRDROP_API_REQUEST.AIRDROP" })
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: AirdropReqDto })
    airdrop(@Body() dto: AirdropReqDto, @UploadedFile() file?: Express.Multer.File): Promise<WalletTypings.Airdrop.Api.AirdropResDto> {
        return this.__airdropService.airdrop(dto, file);
    }

    @Post(WALLET_AIRDROP_API_REQUEST.RETRY_ISSUE_TX_ONCHAIN)
    @ApiOperation({ summary: "空投订单重试发行交易上链", description: "WALLET_AIRDROP_API_REQUEST.RETRY_ISSUE_TX_ONCHAIN" })
    retryIssueTxOnChain(@Body() dto: AirdropRetryIssueTxOnChainReqDto): Promise<WalletTypings.Airdrop.Api.AirdropRetryIssueTxOnChainResDto> {
        return this.__airdropService.retryIssueTxOnChain(dto.orderId);
    }

    @Post(WALLET_AIRDROP_API_REQUEST.RETRY_TRANSFER_TX_ONCHAIN)
    @ApiOperation({ summary: "空投订单重试转移交易上链", description: "WALLET_AIRDROP_API_REQUEST.RETRY_TRANSFER_TX_ONCHAIN" })
    retryTransferTxOnChain(@Body() dto: AirdropRetryTransferTxOnChainReqDto): Promise<WalletTypings.Airdrop.Api.AirdropRetryToTransferOnChainResDto> {
        return this.__airdropService.retryTransferTxOnChain(dto.orderId);
    }

    @Get(WALLET_AIRDROP_API_REQUEST.RECORDS)
    @ApiOperation({ summary: "获取空投记录列表", description: "WALLET_AIRDROP_API_REQUEST.RECORDS" })
    getRecords(@Query() dto: AirdropRecordsReqDto): Promise<WalletTypings.Airdrop.Api.AirdropRecordsResDto> {
        return this.__airdropService.getRecords(dto);
    }

    @Get(WALLET_AIRDROP_API_REQUEST.RECORD_DETAIL)
    @ApiOperation({ summary: "获取空投记录详情", description: "WALLET_AIRDROP_API_REQUEST.RECORD_DETAIL" })
    getRecordDetail(@Query() dto: AirdropRecordDetailReqDto): Promise<WalletTypings.Airdrop.Api.AirdropRecordDetailResDto> {
        return this.__airdropService.getRecordDetail(dto.orderId);
    }
}
