import { Body, Controller, forwardRef, Get, Inject, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
    Erc20BalanceResDto,
    Erc20TransDataReqDto,
    Erc20BalanceReqDto,
    EthSignTransactionReqDto,
    EthCreateTransReqDto,
    EthSendSignTransReqDto,
    EthTransPrepResDto,
    EthTransPrepReqDto,
    EthTransHistoryReqDto,
    EthAccountBalanceV2ReqDto,
    EthGetBlockReqDto,
    EthBrocastDirectReqDto,
    EthBaseReqDto,
    EthQueryTransReqDto,
    EthBrocastDirectNotifyReqDto,
} from "./dto.js";
import { EthService } from "./eth.service.js";
import { ExternalTransType, WALLET_ETH_API_REQUEST } from "@bnqkl/wallet-sdk";
import { TokenInfoDetailReqDto, TokenInfoListReqDto } from "../contract-token-info/dto.js";
import { ContractTokenInfoService } from "../contract-token-info/contract-token-info.service.js";
import { GetExternalPendingTransReqDto } from "../external-chain-trans/dto.js";

@ApiTags("ETH")
@Controller()
export class EthController {
    @Inject(forwardRef(() => EthService))
    private __ethService!: EthService;
    @Inject(forwardRef(() => ContractTokenInfoService))
    private __contractTokenService!: ContractTokenInfoService;

    @Get(WALLET_ETH_API_REQUEST.GET_LAST_BLOCK)
    @ApiOperation({ summary: "eth-获取最新区块", description: "WALLET_ETH_API_REQUEST.GET_LAST_BLOCK" })
    getblock(): Promise<WalletTypings.Eth.Api.EthGetLastBlockResDto> {
        return this.__ethService.getLastBlock();
    }

    @Get(WALLET_ETH_API_REQUEST.GET_BLOCK)
    @ApiOperation({ summary: "eth-获取区块", description: "WALLET_ETH_API_REQUEST.GET_BLOCK" })
    getBlock(@Query() query: EthGetBlockReqDto): Promise<WalletTypings.Eth.Api.EthGetBlockResDto> {
        return this.__ethService.getBlock(query.blockNumber);
    }

    @Get(WALLET_ETH_API_REQUEST.GET_CHAIN_ID)
    @ApiOperation({ summary: "eth-获取chainId", description: "WALLET_ETH_API_REQUEST.GET_CHAIN_ID" })
    getChainId(): Promise<WalletTypings.Eth.Api.EthGetChainIdResDto> {
        return this.__ethService.getChainId();
    }

    @Get(WALLET_ETH_API_REQUEST.GET_BASE_GAS)
    @ApiOperation({ summary: "eth-获取基础Gas信息", description: "WALLET_ETH_API_REQUEST.GET_BASE_GAS" })
    getBaseGas(): Promise<WalletTypings.Eth.Api.EthGetBaseGasResDto> {
        return this.__ethService.getBaseGas();
    }

    @Get(WALLET_ETH_API_REQUEST.GET_GAS_PRICE)
    @ApiOperation({ summary: "eth-获取GasPrice信息", description: "WALLET_ETH_API_REQUEST.GET_GAS_PRICE" })
    getGasPrice(): Promise<WalletTypings.Eth.Api.EthGetGasPriceResDto> {
        return this.__ethService.getGasPrice();
    }

    @Get(WALLET_ETH_API_REQUEST.GET_BALANCE)
    @ApiOperation({ summary: "eth-获取用户余额信息", description: "WALLET_ETH_API_REQUEST.GET_BALANCE" })
    getbalance(@Query() dto: EthBaseReqDto): Promise<WalletTypings.Eth.Api.EthGetBalanceResDto> {
        return this.__ethService.getBalance(dto.address);
    }

    @Get(WALLET_ETH_API_REQUEST.GET_TRANS_COUNT)
    @ApiOperation({ summary: "eth-获取用户交易数", description: "WALLET_ETH_API_REQUEST.GET_TRANS_COUNT" })
    getTransCount(@Query() dto: EthBaseReqDto): Promise<WalletTypings.Eth.Api.EthGetTransCountResDto> {
        return this.__ethService.getTransCount(dto.address);
    }

    @Post(WALLET_ETH_API_REQUEST.TRANS_PREP)
    @ApiOperation({ summary: "eth-交易前需要的预备信息", description: "WALLET_ETH_API_REQUEST.TRANS_PREP" })
    @ApiOkResponse({ type: EthTransPrepResDto })
    getTransPrep(@Body() dto: EthTransPrepReqDto): Promise<WalletTypings.Eth.Api.EthTransPrepResDto> {
        if (dto.type === ExternalTransType.CONTRACT && !dto.contractAddress) {
            throw Error(`PARAMETER ERROR`);
        }
        return this.__ethService.getTransPrep(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.GET_CONTRACT_BALANCE)
    @ApiOperation({ summary: "eth-获取用户合约余额信息", description: "WALLET_ETH_API_REQUEST.GET_CONTRACT_BALANCE" })
    @ApiOkResponse({ type: Erc20BalanceResDto })
    getContractBalance(@Body() dto: Erc20BalanceReqDto): Promise<WalletTypings.Eth.Api.Erc20BalanceResDto> {
        return this.__ethService.getContractBalanceAndDecimal(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.GET_CONTRACT_DATA)
    @ApiOperation({ summary: "eth-获取合约交易的data", description: "WALLET_ETH_API_REQUEST.GET_CONTRACT_DATA" })
    getContractTransData(@Body() dto: Erc20TransDataReqDto): Promise<WalletTypings.Eth.Api.Erc20TransDataResDto> {
        return this.__ethService.getContractTransData(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.TRANS_SEND)
    @ApiOperation({ summary: "eth-发送已签名的交易", description: "WALLET_ETH_API_REQUEST.TRANS_SEND" })
    sendSignTrans(@Body() dto: EthSendSignTransReqDto): Promise<WalletTypings.Eth.Api.EthSendSignTransResDto> {
        return this.__ethService.sendSignTrans(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.GET_NORMAL_HISTORY)
    @ApiOperation({ summary: "eth-查询指定地址的普通交易历史", description: "WALLET_ETH_API_REQUEST.GET_NORMAL_HISTORY" })
    getNormalTransHistory(@Body() dto: EthTransHistoryReqDto): Promise<WalletTypings.Eth.Api.EthTransHistoryResDto> {
        return this.__ethService.getNormalTransHistory(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.GET_CONTRACT_HISTORY)
    @ApiOperation({ summary: "eth-查询指定地址的合约交易历史", description: "WALLET_ETH_API_REQUEST.GET_CONTRACT_HISTORY" })
    getErc20TransHistory(@Body() dto: EthTransHistoryReqDto): Promise<WalletTypings.Eth.Api.Erc20TransHistoryResDto> {
        if (!dto.contractaddress) {
            throw Error(`PARAMETER ERROR`);
        }
        return this.__ethService.getErc20TransHistory(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.GET_CONTRACT_TOKENS)
    @ApiOperation({ summary: "eth-查询合约代币列表(只提供ERC20协议的代币)", description: "WALLET_ETH_API_REQUEST.GET_CONTRACT_TOKENS" })
    getTokenInfoList(@Body() dto: TokenInfoListReqDto): Promise<WalletTypings.Eth.Api.TokenInfoListResDto> {
        return this.__contractTokenService.getInfoListByPage(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL)
    @ApiOperation({ summary: "eth-查询合约代币详情", description: "WALLET_ETH_API_REQUEST.GET_CONTRACT_TOKEN_DETAIL" })
    getTokenInfoDetail(@Body() dto: TokenInfoDetailReqDto): Promise<WalletTypings.Eth.Api.TokenInfoDetailResDto> {
        return this.__contractTokenService.getTokenInfoDetail(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.GET_BALANCE_V2)
    @ApiOperation({ summary: "eth-查询账户余额V2", description: "WALLET_ETH_API_REQUEST.GET_BALANCE_V2" })
    getContractsBalance(@Body() dto: EthAccountBalanceV2ReqDto): Promise<WalletTypings.Eth.Api.EthAccountBalanceV2ResDto> {
        return this.__ethService.getAccountBalanceV2(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.TRANS_PENDING)
    @ApiOperation({ summary: "eth-查询pending状态交易", description: "WALLET_ETH_API_REQUEST.TRANS_PENDING" })
    getPendingTransaction(@Body() dto: GetExternalPendingTransReqDto): Promise<WalletTypings.Eth.Api.EthPendingTransResDto> {
        return this.__ethService.getPendingTransaction(dto);
    }

    @Get(WALLET_ETH_API_REQUEST.TRANS_QUERY)
    @ApiOperation({ summary: "eth-交易基础信息查询", description: "WALLET_ETH_API_REQUEST.TRANS_QUERY" })
    getTransaction(@Query() dto: EthQueryTransReqDto): Promise<WalletTypings.Eth.Api.EthQueryTransResDto> {
        return this.__ethService.getTrans(dto.txHash);
    }

    @Post(WALLET_ETH_API_REQUEST.TRANS_SIGN)
    @ApiOperation({ summary: "eth-对交易数据进行签名(仅测试环境使用)", description: "WALLET_ETH_API_REQUEST.TRANS_SIGN" })
    signTransaction(@Body() dto: EthSignTransactionReqDto): Promise<WalletTypings.Eth.Api.EthSignTransactionResDto> {
        return this.__ethService.signTransaction(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.TRANS_CREATE)
    @ApiOperation({ summary: "eth-普通交易测试(仅测试环境使用)", description: "WALLET_ETH_API_REQUEST.TRANS_CREATE" })
    createTrans(@Body() dto: EthCreateTransReqDto): Promise<WalletTypings.Eth.Api.EthCreateTransResDto> {
        return this.__ethService.createTrans(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.TRANS_ERC20_CREATE)
    @ApiOperation({ summary: "eth-合约交易测试(仅测试环境使用)", description: "WALLET_ETH_API_REQUEST.TRANS_ERC20_CREATE" })
    createContractTrans(@Body() dto: EthCreateTransReqDto): Promise<WalletTypings.Eth.Api.EthCreateTransResDto> {
        return this.__ethService.createContractTrans(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.BROADCAST_DIRECT)
    @ApiOperation({ summary: "eth-直接广播", description: "WALLET_ETH_API_REQUEST.BROADCAST_DIRECT" })
    broadcastDirect(@Body() dto: EthBrocastDirectReqDto): Promise<WalletTypings.Eth.Api.EthBrocastDirectResDto> {
        return this.__ethService.sdkBroadcastTransaction(dto);
    }

    @Post(WALLET_ETH_API_REQUEST.BROADCAST_DIRECT_NOTIFY)
    @ApiOperation({ summary: "eth-直接广播-通知", description: "WALLET_ETH_API_REQUEST.BROADCAST_DIRECT_NOTIFY" })
    broadcastDirectNotify(@Body() dto: EthBrocastDirectNotifyReqDto): Promise<WalletTypings.Eth.Api.EthBrocastDirectResDto> {
        return this.__ethService.sdkBroadcastTransactionNotify(dto);
    }
}
