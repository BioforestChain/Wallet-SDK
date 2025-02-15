import { WALLET_TRON_API_REQUEST } from "@bnqkl/wallet-sdk";
import { Body, Controller, forwardRef, Get, Inject, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ContractTokenInfoService } from "../contract-token-info/contract-token-info.service";
import { TokenInfoDetailReqDto, TokenInfoListReqDto } from "../contract-token-info/dto";
import {
    TronCreateTransDto,
    TRC20TransactionDto,
    TriggerSmartContractDto,
    TronTransactionDto,
    TronBaseReqDto,
    TronBroadcastTransDto,
    Trc20BalanceResDto,
    TronBalanceReqDto,
    TronAccountResourceResDto,
    TronTransHistoryReqDto,
    TronTransReceiptReqDto,
    TronAccountBalanceV2ReqDto,
    Trc20ContractReqDto,
    TronSendTrxDto,
    TronSendTrc20Dto,
    TronTransBodyDto,
    Trc20TransBodyDto,
    TRC20TransactionNotifyDto,
} from "./dto";
import { TronService } from "./tron.service";
import { GetExternalPendingTransReqDto } from "../external-chain-trans/dto";
@ApiTags("TRON")
@Controller()
export class TronController {
    @Inject(forwardRef(() => TronService))
    private __tronService!: TronService;
    @Inject(forwardRef(() => ContractTokenInfoService))
    private __contractTokenService!: ContractTokenInfoService;

    @Get(WALLET_TRON_API_REQUEST.GET_LAST_BLOCK)
    @ApiOperation({ summary: "tron-获取最新区块信息", description: "WALLET_TRON_API_REQUEST.GET_LAST_BLOCK" })
    getNowBlock(): Promise<WalletTypings.Tron.Api.TronGetLastBlockResDto> {
        return this.__tronService.getNowBlock();
    }

    @Get(WALLET_TRON_API_REQUEST.GET_BALANCE)
    @ApiOperation({ summary: "tron-获取用户余额", description: "WALLET_TRON_API_REQUEST.GET_BALANCE" })
    getBalance(@Query() dto: TronBaseReqDto): Promise<WalletTypings.Tron.Api.TronGetBalanceResDto> {
        return this.__tronService.getTrxBalance(dto);
    }

    @Get(WALLET_TRON_API_REQUEST.GET_ACCOUNT)
    @ApiOperation({ summary: "tron-获取账户信息", description: "WALLET_TRON_API_REQUEST.GET_ACCOUNT" })
    getAccount(@Query() dto: TronBaseReqDto): Promise<WalletTypings.Tron.Api.TronGetAccountResDto> {
        return this.__tronService.getAccount(dto);
    }

    @Get(WALLET_TRON_API_REQUEST.GET_ACCOUNT_RESOURCE)
    @ApiOperation({ summary: "tron-获取账户资源信息", description: "WALLET_TRON_API_REQUEST.GET_ACCOUNT_RESOURCE" })
    @ApiOkResponse({ type: TronAccountResourceResDto })
    getAccountResource(@Query() dto: TronBaseReqDto): Promise<WalletTypings.Tron.Api.TronGetAccountResourceResDto> {
        return this.__tronService.getAccountResource(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE)
    @ApiOperation({ summary: "tron-获取指定合约代币余额", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE" })
    getContractBalance(@Body() dto: TronBalanceReqDto): Promise<WalletTypings.Tron.Api.Trc20BalanceResDto> {
        if (dto.visible && !dto.hex_address) {
            throw new Error("参数错误，缺少必要的hex_address");
        }
        return this.__tronService.getTRC20Balance(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_V2)
    @ApiOperation({ summary: "tron-获取指定合约代币余额V2", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_V2" })
    getContractBalanceV2(@Body() dto: Trc20ContractReqDto): Promise<WalletTypings.Tron.Api.Trc20BalanceV2ResDto> {
        return this.__tronService.getContractBalance(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_DECIMAL)
    @ApiOperation({ summary: "tron-获取指定合约代币精度", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_DECIMAL" })
    getContractDecimal(@Body() dto: TronBalanceReqDto): Promise<WalletTypings.Tron.Api.Trc20DecimalResDto> {
        if (dto.visible && !dto.hex_address) {
            throw new Error("参数错误，缺少必要的hex_address");
        }
        return this.__tronService.getTRC20Decimal(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_DECIMAL_V2)
    @ApiOperation({ summary: "tron-获取指定合约代币精度V2", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_DECIMAL_V2" })
    getContractDecimalV2(@Body() dto: Trc20ContractReqDto): Promise<WalletTypings.Tron.Api.Trc20DecimalV2ResDto> {
        return this.__tronService.getContractDecimal(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_AND_DECIMAL)
    @ApiOperation({ summary: "tron-获取合约余额和精度", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_AND_DECIMAL" })
    @ApiOkResponse({ type: Trc20BalanceResDto })
    getContractBalanceAndDecimal(@Body() dto: TronBalanceReqDto): Promise<WalletTypings.Tron.Api.Trc20BalanceAndDecimalResDto> {
        if (dto.visible && !dto.hex_address) {
            throw new Error("参数错误，缺少必要的hex_address");
        }
        return this.__tronService.getContractBalanceAndDecimal(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_AND_DECIMAL_V2)
    @ApiOperation({ summary: "tron-获取合约余额和精度V2", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_AND_DECIMAL_V2" })
    getContractBalanceAndDecimalV2(@Body() dto: Trc20ContractReqDto): Promise<WalletTypings.Tron.Api.Trc20BalanceAndDecimalV2ResDto> {
        return this.__tronService.getContract(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.CREATE_NORMAL_TRANS)
    @ApiOperation({ summary: "tron-创建TRX普通交易", description: "WALLET_TRON_API_REQUEST.CREATE_NORMAL_TRANS" })
    @ApiOkResponse({ type: TronTransactionDto })
    createNormalTrans(@Body() dto: TronCreateTransDto): Promise<WalletTypings.Tron.Api.TronCreateNormalTransResDto> {
        return this.__tronService.createTronTransaction(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.CREATE_NORMAL_TRANS_V2)
    @ApiOperation({ summary: "tron-创建TRX普通交易V2", description: "WALLET_TRON_API_REQUEST.CREATE_NORMAL_TRANS_V2" })
    @ApiOkResponse({ type: TronTransBodyDto })
    createNormalTransV2(@Body() dto: TronSendTrxDto): Promise<WalletTypings.Tron.Api.TronCreateNormalTransV2ResDto> {
        return this.__tronService.sendTrx(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.CREATE_CONTRACT_TRANS)
    @ApiOperation({ summary: "tron-创建TRC20交易", description: "WALLET_TRON_API_REQUEST.CREATE_CONTRACT_TRANS" })
    @ApiOkResponse({ type: TRC20TransactionDto })
    createContractTrans(@Body() dto: TriggerSmartContractDto): Promise<WalletTypings.Tron.Api.TronCreateContractTransResDto> {
        return this.__tronService.triggerSmartContract(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.CREATE_CONTRACT_TRANS_V2)
    @ApiOperation({ summary: "tron-创建TRC20交易V2", description: "WALLET_TRON_API_REQUEST.CREATE_CONTRACT_TRANS_V2" })
    @ApiOkResponse({ type: Trc20TransBodyDto })
    createContractTransV2(@Body() dto: TronSendTrc20Dto): Promise<WalletTypings.Tron.Api.TronCreateContractTransV2ResDto> {
        return this.__tronService.sendTrc20(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.BROADCAST_NORMAL_TRANS)
    @ApiOperation({ summary: "tron-普通转账交易广播", description: "WALLET_TRON_API_REQUEST.BROADCAST_NORMAL_TRANS" })
    @ApiOkResponse({ type: TronBroadcastTransDto })
    broadcastNormalTrans(@Body() dto: TronTransactionDto): Promise<WalletTypings.Tron.Api.TronBroadcastNormalTransResDto> {
        return this.__tronService.broadcastTronTransaction(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.BROADCAST_CONTRACT_TRANS)
    @ApiOperation({ summary: "tron-TRC20交易广播", description: "WALLET_TRON_API_REQUEST.BROADCAST_CONTRACT_TRANS" })
    @ApiOkResponse({ type: TronBroadcastTransDto })
    broadcastContractTrans(@Body() dto: TRC20TransactionDto): Promise<WalletTypings.Tron.Api.TronBroadcastContractTransResDto> {
        return this.__tronService.broadcastTronTransaction(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_NORMAL_HISTORY)
    @ApiOperation({ summary: "tron-查询指定地址的普通交易历史", description: "WALLET_TRON_API_REQUEST.GET_NORMAL_HISTORY" })
    getCommonTransHistory(@Body() dto: TronTransHistoryReqDto): Promise<WalletTypings.Tron.Api.TronTransHistoryResDto> {
        return this.__tronService.getCommonTransHistory(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_HISTORY)
    @ApiOperation({ summary: "tron-查询指定地址的合约交易历史", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_HISTORY" })
    getTrc20TransHistory(@Body() dto: TronTransHistoryReqDto): Promise<WalletTypings.Tron.Api.Trc20TransHistoryResDto> {
        if (!dto.contract_address) {
            throw Error(`PARAMETER ERROR`);
        }
        return this.__tronService.getTrc20TransHistory(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_TOKENS)
    @ApiOperation({ summary: "tron-查询合约代币列表(只提供TRC20协议的代币)", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_TOKENS" })
    getTokenInfoList(@Body() dto: TokenInfoListReqDto): Promise<WalletTypings.Tron.Api.TokenInfoListResDto> {
        return this.__contractTokenService.getInfoListByPage(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL)
    @ApiOperation({ summary: "tron-查询合约代币详情", description: "WALLET_TRON_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL" })
    getTokenInfoDetail(@Body() dto: TokenInfoDetailReqDto): Promise<WalletTypings.Tron.Api.TokenInfoDetailResDto> {
        return this.__contractTokenService.getTokenInfoDetail(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.GET_BALANCE_V2)
    @ApiOperation({ summary: "tron-查询账户余额V2", description: "WALLET_TRON_API_REQUEST.GET_BALANCE_V2" })
    getAccountBalanceV2(@Body() dto: TronAccountBalanceV2ReqDto): Promise<WalletTypings.Tron.Api.TronAccountBalanceV2ResDto> {
        return this.__tronService.getAccountBalanceV2(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.TRANS_PENDING)
    @ApiOperation({ summary: "tron-查询pending状态交易", description: "WALLET_TRON_API_REQUEST.TRANS_PENDING" })
    getPendingTransaction(@Body() dto: GetExternalPendingTransReqDto): Promise<WalletTypings.Tron.Api.TronPendingTransResDto> {
        return this.__tronService.getPendingTransaction(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.TRANS_RECEIPT)
    @ApiOperation({ summary: "tron-查询已完成交易详情", description: "WALLET_TRON_API_REQUEST.TRANS_RECEIPT" })
    getReceiptTransaction(@Body() dto: TronTransReceiptReqDto): Promise<WalletTypings.Tron.Api.TronReceiptTransResDto> {
        return this.__tronService.getTransactionInfoById(dto.txId);
    }

    @Post(WALLET_TRON_API_REQUEST.BROADCAST_DIRECT)
    @ApiOperation({ summary: "tron-直接广播", description: "WALLET_TRON_API_REQUEST.BROADCAST_DIRECT" })
    broadcastDirect(@Body() dto: TRC20TransactionDto): Promise<WalletTypings.Tron.Api.TronBrocastDirectResDto> {
        return this.__tronService.sdkBroadcastTransaction(dto);
    }

    @Post(WALLET_TRON_API_REQUEST.BROADCAST_DIRECT_NOTIFY)
    @ApiOperation({ summary: "tron-直接广播-通知", description: "WALLET_TRON_API_REQUEST.BROADCAST_DIRECT_NOTIFY" })
    broadcastDirectNotify(@Body() dto: TRC20TransactionNotifyDto): Promise<WalletTypings.Tron.Api.TronBrocastDirectResDto> {
        return this.__tronService.sdkBroadcastTransactionNotify(dto);
    }
}
