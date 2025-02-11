import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
    CreateExternalTransferReqDto,
    CreateExternalTransObjReqDto,
    GetExternalAccountBalanceReqDto,
    GetExternalBalanceReqDto,
    GetExternalForgeIntervalReqDto,
    GetExternalTransReqDto,
    GetExternalTransFeeInfoReqDto,
    SaveExternalTransactionReqDto,
    UpdateExternalTransStateReqDto,
} from "./dto";
import { ExternalChainTransMgr } from "./external-chain-trans-mgr";
import { WALLET_EXTERNAL_CHAIN_API_REQUEST } from "@bnqkl/wallet-sdk";

@ApiTags("EXTERNAL-CHAIN")
@Controller()
export class ExternalChainTransController {
    @Inject(forwardRef(() => ExternalChainTransMgr))
    private __externalChainTransMgr!: ExternalChainTransMgr;

    @Post(WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER)
    @ApiOperation({ summary: "生成外链转账交易", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER" })
    createTransfer(@Body() dto: CreateExternalTransferReqDto): Promise<WalletTypings.ExternalChain.Api.CreateExternalTransferResDto> {
        return this.__externalChainTransMgr.createTransfer(dto);
    }

    @Post(WALLET_EXTERNAL_CHAIN_API_REQUEST.SAVE_TRANSFER)
    @ApiOperation({ summary: "保存外链转账交易", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.SAVE_TRANSFER" })
    saveTransfer(@Body() dto: SaveExternalTransactionReqDto): Promise<WalletTypings.ExternalChain.Api.SaveExternalTransactionResDto> {
        return this.__externalChainTransMgr.saveTransaction(dto);
    }

    @Post(WALLET_EXTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION)
    @ApiOperation({ summary: "保存外链交易", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION" })
    saveTransaction(@Body() dto: SaveExternalTransactionReqDto): Promise<WalletTypings.ExternalChain.Api.SaveExternalTransactionResDto> {
        return this.__externalChainTransMgr.saveTransaction(dto);
    }

    @Post(WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ)
    @ApiOperation({ summary: "生成外链交易逻辑对象", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ" })
    createTransObj(@Body() dto: CreateExternalTransObjReqDto): Promise<void> {
        return this.__externalChainTransMgr.createTransObj(dto);
    }

    @Get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS)
    @ApiOperation({ summary: "获取外链交易", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS" })
    getTrans(@Query() dto: GetExternalTransReqDto): Promise<WalletTypings.ExternalChain.Api.GetExternalTransResDto> {
        return this.__externalChainTransMgr.getTrans(dto);
    }

    @Get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS_FEE_INFO)
    @ApiOperation({ summary: "获取外链交易手续费信息", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS_FEE_INFO" })
    getTransFeeInfo(@Query() dto: GetExternalTransFeeInfoReqDto): Promise<WalletTypings.ExternalChain.Api.GetExternalTransFeeInfoResDto> {
        return this.__externalChainTransMgr.getTransFeeInfo(dto);
    }

    @Get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_BALANCE)
    @ApiOperation({ summary: "获取外链主币余额", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_BALANCE" })
    getBalance(@Query() dto: GetExternalBalanceReqDto): Promise<string> {
        return this.__externalChainTransMgr.getBalance(dto);
    }

    @Get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE)
    @ApiOperation({ summary: "获取外链账户余额", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE" })
    getAccountBalance(@Query() dto: GetExternalAccountBalanceReqDto): Promise<WalletTypings.ExternalChain.Api.GetExternalAccountBalanceResDto> {
        return this.__externalChainTransMgr.getAccountBalance(dto);
    }

    @Post(WALLET_EXTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE)
    @ApiOperation({ summary: "更新外链交易状态", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE" })
    updateTransState(@Body() dto: UpdateExternalTransStateReqDto): Promise<WalletTypings.ExternalChain.Api.UpdateExternalTransStateResDto> {
        return this.__externalChainTransMgr.updateTransState(dto);
    }

    @Get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_FORGE_INTERVAL)
    @ApiOperation({ summary: "获取外链打块间隔", description: "WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_FORGE_INTERVAL" })
    getForgeInterval(@Query() dto: GetExternalForgeIntervalReqDto): number {
        return this.__externalChainTransMgr.getForgeInterval(dto);
    }
}
