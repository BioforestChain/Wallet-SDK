import { Body, Controller, forwardRef, Get, Inject, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
    Bep20BalanceResDto,
    Bep20TransDataReqDto,
    Bep20BalanceReqDto,
    BscSignTransactionReqDto,
    BscCreateTransReqDto,
    BscSendSignTransReqDto,
    BscTransPrepResDto,
    BscTransPrepReqDto,
    BscTransHistoryReqDto,
    BscAccountBalanceV2ReqDto,
    BscGetBlockReqDto,
    BscBrocastDirectReqDto,
    BscBaseReqDto,
    BscQueryTransReqDto,
} from "./dto";

import { BscService } from "./bsc.service";
import { ExternalTransType, WALLET_BSC_API_REQUEST } from "@bnqkl/wallet-sdk";
import { TokenInfoDetailReqDto, TokenInfoListReqDto } from "../contract-token-info/dto";
import { ContractTokenInfoService } from "../contract-token-info/contract-token-info.service";
import { GetExternalPendingTransReqDto } from "../external-chain-trans/dto";

@ApiTags("BSC")
@Controller()
export class BscController {
    @Inject(forwardRef(() => BscService))
    private __bscService!: BscService;
    @Inject(forwardRef(() => ContractTokenInfoService))
    private __contractTokenService!: ContractTokenInfoService;

    @Get(WALLET_BSC_API_REQUEST.GET_LAST_BLOCK)
    @ApiOperation({ summary: "bsc-获取最新区块", description: "WALLET_BSC_API_REQUEST.GET_LAST_BLOCK" })
    getblock(): Promise<WalletTypings.Bsc.Api.BscGetLastBlockResDto> {
        return this.__bscService.getLastBlock();
    }

    @Get(WALLET_BSC_API_REQUEST.GET_BLOCK)
    @ApiOperation({ summary: "bsc-获取区块", description: "WALLET_BSC_API_REQUEST.GET_BLOCK" })
    getBlock(@Query() query: BscGetBlockReqDto): Promise<WalletTypings.Bsc.Api.BscGetBlockResDto> {
        return this.__bscService.getBlock(query.blockNumber);
    }

    @Get(WALLET_BSC_API_REQUEST.GET_CHAIN_ID)
    @ApiOperation({ summary: "bsc-获取chainId", description: "WALLET_BSC_API_REQUEST.GET_CHAIN_ID" })
    getChainId(): Promise<WalletTypings.Bsc.Api.BscGetChainIdResDto> {
        return this.__bscService.getChainId();
    }

    @Get(WALLET_BSC_API_REQUEST.GET_BASE_GAS)
    @ApiOperation({ summary: "bsc-获取基础Gas信息", description: "WALLET_BSC_API_REQUEST.GET_BASE_GAS" })
    getBaseGas(): Promise<WalletTypings.Bsc.Api.BscGetBaseGasResDto> {
        return this.__bscService.getBaseGas();
    }

    @Get(WALLET_BSC_API_REQUEST.GET_GAS_PRICE)
    @ApiOperation({ summary: "bsc-获取GasPrice信息", description: "WALLET_BSC_API_REQUEST.GET_GAS_PRICE" })
    getGasPrice(): Promise<WalletTypings.Bsc.Api.BscGetGasPriceResDto> {
        return this.__bscService.getGasPrice();
    }

    @Get(WALLET_BSC_API_REQUEST.GET_BALANCE)
    @ApiOperation({ summary: "bsc-获取用户余额信息", description: "WALLET_BSC_API_REQUEST.GET_BALANCE" })
    getbalance(@Query() dto: BscBaseReqDto): Promise<WalletTypings.Bsc.Api.BscGetBalanceResDto> {
        return this.__bscService.getBalance(dto.address);
    }

    @Get(WALLET_BSC_API_REQUEST.GET_TRANS_COUNT)
    @ApiOperation({ summary: "bsc-获取用户交易数", description: "WALLET_BSC_API_REQUEST.GET_TRANS_COUNT" })
    getTransCount(@Query() dto: BscBaseReqDto): Promise<WalletTypings.Bsc.Api.BscGetTransCountResDto> {
        return this.__bscService.getTransCount(dto.address);
    }

    @Post(WALLET_BSC_API_REQUEST.TRANS_PREP)
    @ApiOperation({ summary: "bsc-交易前需要的预备信息", description: "WALLET_BSC_API_REQUEST.TRANS_PREP" })
    @ApiOkResponse({ type: BscTransPrepResDto })
    getTransPrep(@Body() dto: BscTransPrepReqDto): Promise<WalletTypings.Bsc.Api.BscTransPrepResDto> {
        if (dto.type === ExternalTransType.CONTRACT && !dto.contractAddress) {
            throw Error(`PARAMETER ERROR`);
        }
        return this.__bscService.getTransPrep(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.GET_CONTRACT_BALANCE)
    @ApiOperation({ summary: "bsc-获取用户合约余额信息", description: "WALLET_BSC_API_REQUEST.GET_CONTRACT_BALANCE" })
    @ApiOkResponse({ type: Bep20BalanceResDto })
    getContractBalance(@Body() dto: Bep20BalanceReqDto): Promise<WalletTypings.Bsc.Api.Bep20BalanceResDto> {
        return this.__bscService.getContractBalanceAndDecimal(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.GET_CONTRACT_DATA)
    @ApiOperation({ summary: "bsc-获取合约交易的data", description: "WALLET_BSC_API_REQUEST.GET_CONTRACT_DATA" })
    getContractTransData(@Body() dto: Bep20TransDataReqDto): Promise<WalletTypings.Bsc.Api.Bep20TransDataResDto> {
        return this.__bscService.getContractTransData(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.TRANS_SEND)
    @ApiOperation({ summary: "bsc-发送已签名的交易", description: "WALLET_BSC_API_REQUEST.TRANS_SEND" })
    sendSignTrans(@Body() dto: BscSendSignTransReqDto): Promise<WalletTypings.Bsc.Api.BscSendSignTransResDto> {
        return this.__bscService.sendSignTrans(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.GET_NORMAL_HISTORY)
    @ApiOperation({ summary: "bsc-查询指定地址的普通交易历史", description: "WALLET_BSC_API_REQUEST.GET_NORMAL_HISTORY" })
    getNormalTransHistory(@Body() dto: BscTransHistoryReqDto): Promise<WalletTypings.Bsc.Api.BscTransHistoryResDto> {
        return this.__bscService.getNormalTransHistory(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.GET_CONTRACT_HISTORY)
    @ApiOperation({ summary: "bsc-查询指定地址的合约交易历史", description: "WALLET_BSC_API_REQUEST.GET_CONTRACT_HISTORY" })
    getBep20TransHistory(@Body() dto: BscTransHistoryReqDto): Promise<WalletTypings.Bsc.Api.Bep20TransHistoryResDto> {
        if (!dto.contractaddress) {
            throw Error(`PARAMETER ERROR`);
        }
        return this.__bscService.getBep20TransHistory(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.GET_CONTRACT_TOKENS)
    @ApiOperation({ summary: "bsc-查询合约代币列表(只提供BEP20协议的代币)", description: "WALLET_BSC_API_REQUEST.GET_CONTRACT_TOKENS" })
    getTokenInfoList(@Body() dto: TokenInfoListReqDto): Promise<WalletTypings.Bsc.Api.TokenInfoListResDto> {
        return this.__contractTokenService.getInfoListByPage(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL)
    @ApiOperation({ summary: "bsc-查询合约代币详情", description: "WALLET_BSC_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL" })
    getTokenInfoDetail(@Body() dto: TokenInfoDetailReqDto): Promise<WalletTypings.Bsc.Api.TokenInfoDetailResDto> {
        return this.__contractTokenService.getTokenInfoDetail(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.GET_BALANCE_V2)
    @ApiOperation({ summary: "bsc-查询账户余额V2", description: "WALLET_BSC_API_REQUEST.GET_BALANCE_V2" })
    getContractsBalance(@Body() dto: BscAccountBalanceV2ReqDto): Promise<WalletTypings.Bsc.Api.BscAccountBalanceV2ResDto> {
        return this.__bscService.getAccountBalanceV2(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.TRANS_PENDING)
    @ApiOperation({ summary: "bsc-查询pending状态交易", description: "WALLET_BSC_API_REQUEST.TRANS_PENDING" })
    getPendingTransaction(@Body() dto: GetExternalPendingTransReqDto): Promise<WalletTypings.Bsc.Api.BscPendingTransResDto> {
        return this.__bscService.getPendingTransaction(dto);
    }

    @Get(WALLET_BSC_API_REQUEST.TRANS_QUERY)
    @ApiOperation({ summary: "bsc-交易基础信息查询", description: "WALLET_BSC_API_REQUEST.TRANS_QUERY" })
    getTransaction(@Query() dto: BscQueryTransReqDto): Promise<WalletTypings.Bsc.Api.BscQueryTransResDto> {
        return this.__bscService.getTrans(dto.txHash);
    }

    @Post(WALLET_BSC_API_REQUEST.TRANS_SIGN)
    @ApiOperation({ summary: "bsc-对交易数据进行签名(仅测试环境使用)", description: "WALLET_BSC_API_REQUEST.TRANS_SIGN" })
    signTransaction(@Body() dto: BscSignTransactionReqDto): Promise<WalletTypings.Bsc.Api.BscSignTransactionResDto> {
        return this.__bscService.signTransaction(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.TRANS_CREATE)
    @ApiOperation({ summary: "bsc-普通交易测试(仅测试环境使用)", description: "WALLET_BSC_API_REQUEST.TRANS_CREATE" })
    createTrans(@Body() dto: BscCreateTransReqDto): Promise<WalletTypings.Bsc.Api.BscCreateTransResDto> {
        return this.__bscService.createTrans(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.TRANS_BEP20_CREATE)
    @ApiOperation({ summary: "bsc-合约交易测试(仅测试环境使用)", description: "WALLET_BSC_API_REQUEST.TRANS_BEP20_CREATE" })
    createContractTrans(@Body() dto: BscCreateTransReqDto): Promise<WalletTypings.Bsc.Api.BscCreateTransResDto> {
        return this.__bscService.createContractTrans(dto);
    }

    @Post(WALLET_BSC_API_REQUEST.BROADCAST_DIRECT)
    @ApiOperation({ summary: "bsc-直接广播", description: "WALLET_BSC_API_REQUEST.BROADCAST_DIRECT" })
    broadcastDirect(@Body() dto: BscBrocastDirectReqDto): Promise<WalletTypings.Bsc.Api.BscBrocastDirectResDto> {
        return this.__bscService.sdkBroadcastTransaction(dto);
    }
}
