import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ContractTokenInfoService } from "./contract-token-info.service";
import { TokenInfoReqDto, TokenInfoByChainReqDto } from "./dto";
import { WALLET_CONTRACT_TOKEN_INFO_API_REQUEST } from "@bnqkl/wallet-sdk";

@ApiTags("CONTRACT-TOKEN-INFO")
@Controller()
export class ContractTokenInfoController {
    @Inject(forwardRef(() => ContractTokenInfoService))
    private __contractTokenInfoService!: ContractTokenInfoService;

    @Get(WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_INFO)
    @ApiOperation({ summary: "获取合约token信息", description: "WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_INFO" })
    async getTokenInfo(@Query() dto: TokenInfoReqDto): Promise<WalletTypings.ContractTokenInfo.Api.TokenInfoResDto> {
        const { chainName, contractAddress } = dto;
        return this.__contractTokenInfoService.getContractInfoForce(chainName, contractAddress);
    }

    @Get(WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_BY_CHAIN)
    @ApiOperation({ summary: "指定链名称，获取合约信息列表", description: "WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_BY_CHAIN" })
    async getTokenByChain(@Query() dto: TokenInfoByChainReqDto): Promise<WalletTypings.ContractTokenInfo.Api.TokenInfoByChainResDto> {
        return this.__contractTokenInfoService.getTokenInfoByChain(dto.chainName);
    }
}
