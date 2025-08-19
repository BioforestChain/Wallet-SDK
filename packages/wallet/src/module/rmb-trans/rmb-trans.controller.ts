import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateRmbTransObjReqDto, GetRmbTransReqDto, NotifyAlipayReqDto, SaveRmbTransactionReqDto, UpdateRmbTransStateReqDto } from "./dto.js";
import { RmbTransService } from "./rmb-trans.service.js";
import { WALLET_RMB_API_REQUEST } from "@bnqkl/wallet-sdk";

@ApiTags("RMB")
@Controller()
export class RmbTransController {
    @Inject(forwardRef(() => RmbTransService))
    private __rmbTransService!: RmbTransService;

    @Post(WALLET_RMB_API_REQUEST.SAVE_TRANSACTION)
    @ApiOperation({ summary: "保存人民币交易", description: "WALLET_RMB_API_REQUEST.SAVE_TRANSACTION" })
    saveTransaction(@Body() dto: SaveRmbTransactionReqDto): Promise<WalletTypings.Rmb.Api.SaveRmbTransactionResDto> {
        return this.__rmbTransService.saveTransaction(dto);
    }

    @Post(WALLET_RMB_API_REQUEST.CREATE_TRANS_OBJ)
    @ApiOperation({ summary: "生成人民币交易逻辑对象", description: "WALLET_RMB_API_REQUEST.CREATE_TRANS_OBJ" })
    createTransObj(@Body() dto: CreateRmbTransObjReqDto): Promise<void> {
        return this.__rmbTransService.createTransObj(dto);
    }

    @Get(WALLET_RMB_API_REQUEST.GET_TRANS)
    @ApiOperation({ summary: "获取人民币交易", description: "WALLET_RMB_API_REQUEST.GET_TRANS" })
    getTrans(@Query() dto: GetRmbTransReqDto): Promise<WalletTypings.Rmb.Api.GetRmbTransResDto> {
        return this.__rmbTransService.getTrans(dto);
    }

    @Post(WALLET_RMB_API_REQUEST.UPDATE_TRANS_STATE)
    @ApiOperation({ summary: "更新人民币交易状态", description: "WALLET_RMB_API_REQUEST.UPDATE_TRANS_STATE" })
    updateTransState(@Body() dto: UpdateRmbTransStateReqDto): Promise<WalletTypings.Rmb.Api.UpdateRmbTransStateResDto> {
        return this.__rmbTransService.updateTransState(dto);
    }

    @Post(WALLET_RMB_API_REQUEST.ALI_PAY_NOTIFY)
    @ApiOperation({ summary: "支付宝订单异步回调通知", description: "WALLET_RMB_API_REQUEST.ALI_PAY_NOTIFY" })
    handleAlipayNotify(@Body() dto: NotifyAlipayReqDto): Promise<WalletTypings.Rmb.Api.NotifyAlipayResDto> {
        return this.__rmbTransService.handleAlipayNotify(dto);
    }
}
