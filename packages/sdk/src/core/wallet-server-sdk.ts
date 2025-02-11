import { NetWorkHelper } from "@bnqkl/server-util";
import {
    WALLET_AIRDROP_API_REQUEST,
    WALLET_BSC_API_REQUEST,
    WALLET_CONTRACT_TOKEN_INFO_API_REQUEST,
    WALLET_ETH_API_REQUEST,
    WALLET_EXTERNAL_CHAIN_API_REQUEST,
    WALLET_GLOBAL_PREFIX,
    WALLET_INTERNAL_CHAIN_API_REQUEST,
    WALLET_RMB_API_REQUEST,
    WALLET_TRON_API_REQUEST,
} from "@bnqkl/wallet-typings";

export class WalletServerSDK {
    private __walletNetWorkHelper: NetWorkHelper;

    constructor(ip: string, port: number) {
        this.__walletNetWorkHelper = new NetWorkHelper(ip, port, WALLET_GLOBAL_PREFIX);
    }

    /**
     * 生成外链转账交易
     * @param dto
     */
    async createExternalTransfer(
        dto: WalletTypings.ExternalChain.Api.CreateExternalTransferReqDto,
    ): Promise<WalletTypings.ExternalChain.Api.CreateExternalTransferResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER, dto);
    }

    /**
     * 保存外链转账交易
     * @param dto
     */
    async saveExternalTransfer(
        dto: WalletTypings.ExternalChain.Api.SaveExternalTransactionReqDto,
    ): Promise<WalletTypings.ExternalChain.Api.SaveExternalTransactionResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_EXTERNAL_CHAIN_API_REQUEST.SAVE_TRANSFER, dto);
    }

    /**
     * 保存外链交易
     * @param dto
     */
    async saveExternalTransaction(
        dto: WalletTypings.ExternalChain.Api.SaveExternalTransactionReqDto,
    ): Promise<WalletTypings.ExternalChain.Api.SaveExternalTransactionResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_EXTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION, dto);
    }

    /**
     * 生成外链交易逻辑对象
     * @param dto
     */
    async createExternalTransObj(dto: WalletTypings.ExternalChain.Api.CreateExternalTransObjReqDto): Promise<void> {
        return await this.__walletNetWorkHelper.post(WALLET_EXTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ, dto);
    }

    /**
     * 获取外链交易
     * @param dto
     */
    async getExternalTrans(dto: WalletTypings.ExternalChain.Api.GetExternalTransReqDto): Promise<WalletTypings.ExternalChain.Api.GetExternalTransResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS, dto);
    }

    /**
     * 获取外链交易手续费信息
     * @param dto
     */
    async getExternalTransFeeInfo(
        dto: WalletTypings.ExternalChain.Api.GetExternalTransFeeInfoReqDto,
    ): Promise<WalletTypings.ExternalChain.Api.GetExternalTransFeeInfoResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_TRANS_FEE_INFO, dto);
    }

    /**
     * 获取外链账户主币余额
     * @param dto
     */
    async getExternalBalance(dto: WalletTypings.ExternalChain.Api.GetExternalBalanceReqDto): Promise<string> {
        return await this.__walletNetWorkHelper.get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_BALANCE, dto);
    }

    /**
     * 获取外链账户余额
     * @param dto
     */
    async getExternalAccountBalance(
        dto: WalletTypings.ExternalChain.Api.GetExternalAccountBalanceReqDto,
    ): Promise<WalletTypings.ExternalChain.Api.GetExternalAccountBalanceResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE, dto);
    }

    /**
     * 更新外链交易状态
     * @param dto
     */
    async updateExternalTransState(
        dto: WalletTypings.ExternalChain.Api.UpdateExternalTransStateReqDto,
    ): Promise<WalletTypings.ExternalChain.Api.UpdateExternalTransStateResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_EXTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE, dto);
    }

    /**
     * 获取外链打块间隔
     * @param dto
     */
    async getExternalForgeInterval(
        dto: WalletTypings.ExternalChain.Api.GetExternalForgeIntervalReqDto,
    ): Promise<WalletTypings.ExternalChain.Api.GetExternalForgeIntervalResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_EXTERNAL_CHAIN_API_REQUEST.GET_FORGE_INTERVAL, dto);
    }

    /**
     * 获取合约token信息
     * @param dto
     */
    async getContractTokenInfo(dto: WalletTypings.ContractTokenInfo.Api.TokenInfoReqDto): Promise<WalletTypings.ContractTokenInfo.Api.TokenInfoResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_INFO, dto);
    }

    /**
     * 获取合约token信息列表
     * @param dto
     * @returns
     */
    async getTokenInfoByChain(
        dto: WalletTypings.ContractTokenInfo.Api.TokenInfoByChainReqDto,
    ): Promise<WalletTypings.ContractTokenInfo.Api.TokenInfoByChainResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_CONTRACT_TOKEN_INFO_API_REQUEST.GET_TOKEN_BY_CHAIN, dto);
    }

    /**
     * eth-获取用户合约余额信息
     * @param dto
     * @returns
     */
    async getEthContractBalance(dto: WalletTypings.Eth.Api.Erc20BalanceReqDto): Promise<WalletTypings.Eth.Api.Erc20BalanceResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_ETH_API_REQUEST.GET_CONTRACT_BALANCE, dto);
    }

    /**
     * bsc-获取用户合约余额信息
     * @param dto
     * @returns
     */
    async getBscContractBalance(dto: WalletTypings.Bsc.Api.Bep20BalanceReqDto): Promise<WalletTypings.Bsc.Api.Bep20BalanceResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_BSC_API_REQUEST.GET_CONTRACT_BALANCE, dto);
    }

    /**
     * tron-获取用户合约余额信息
     * @param dto
     * @returns
     */
    async getTronContractBalance(dto: WalletTypings.Tron.Api.Trc20BalanceAndDecimalV2ReqDto): Promise<WalletTypings.Tron.Api.Trc20BalanceAndDecimalV2ResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_TRON_API_REQUEST.GET_CONTRACT_BALANCE_AND_DECIMAL_V2, dto);
    }

    /**
     * 获取内链最新区块
     * @param dto
     * @returns
     */
    async getInternalLastblock(dto: WalletTypings.InternalChain.Api.GetInternalLastBlockReqDto) {
        return await this.__walletNetWorkHelper.get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_LAST_BLOCK, dto);
    }

    /**
     * 获取内链区块
     * @param dto
     * @returns
     */
    async getInternalBlock(dto: WalletTypings.InternalChain.Api.GetInternalBlockReqDto) {
        return await this.__walletNetWorkHelper.get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_BLOCK, dto);
    }

    /**
     * 生成内链转账交易
     * @param dto
     */
    async createInternalTransfer(
        dto: WalletTypings.InternalChain.Api.CreateInternalTransferAssetReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateInternalTransferAssetResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER, dto);
    }

    /**
     * 生成权益转移交易
     * @param dto
     */
    async createInternalTransferAsset(
        dto: WalletTypings.InternalChain.Api.CreateInternalTransferAssetReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateInternalTransferAssetResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ASSET, dto);
    }

    /**
     * 生成发行权益交易
     * @param dto
     */
    async createInternalIssueAsset(
        dto: WalletTypings.InternalChain.Api.CreateInternalIssueAssetReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateInternalIssueAssetResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ASSET, dto);
    }

    /**
     * 生成增发权益交易
     * @param dto
     */
    async createInternalIncreaseAsset(
        dto: WalletTypings.InternalChain.Api.CreateInternalIncreaseAssetReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateInternalIncreaseAssetResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_INCREASE_ASSET, dto);
    }

    /**
     * 生成销毁权益交易
     * @param dto
     */
    async createInternalDestroyAsset(
        dto: WalletTypings.InternalChain.Api.CreateInternalDestroyAssetReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateInternalDestroyAssetResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_DESTROY_ASSET, dto);
    }

    /**
     * 生成质押权益交易
     * @param dto
     */
    async createInternalStakeAsset(
        dto: WalletTypings.InternalChain.Api.CreateInternalStakeAssetReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateInternalStakeAssetResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_STAKE_ASSET, dto);
    }

    /**
     * 生成解除质押权益交易
     * @param dto
     */
    async createInternalUnstakeAsset(
        dto: WalletTypings.InternalChain.Api.CreateInternalUnstakeAssetReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateInternalUnstakeAssetResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_UNSTAKE_ASSET, dto);
    }

    /**
     * 生成发行非同质资产模板交易
     * @param dto
     */
    async createIssueEntityFactory(
        dto: WalletTypings.InternalChain.Api.CreateIssueEntityFactoryReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityFactoryResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_FACTORY, dto);
    }

    /**
     * 生成发行非同质资产交易
     * @param dto
     */
    async createIssueEntity(dto: WalletTypings.InternalChain.Api.CreateIssueEntityReqDto): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY, dto);
    }

    /**
     * 生成批量发行非同质资产交易
     * @param dto
     */
    async createIssueEntityMulti(
        dto: WalletTypings.InternalChain.Api.CreateIssueEntityMultiReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateIssueEntityMultiResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_ISSUE_ENTITY_MULTI, dto);
    }

    /**
     * 生成转移资产交易
     * @param dto
     */
    async createTransferEntity(
        dto: WalletTypings.InternalChain.Api.CreateTransferEntityReqDto,
    ): Promise<WalletTypings.InternalChain.Api.CreateTransferEntityResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANSFER_ENTITY, dto);
    }

    /**
     * 保存内链转账交易
     * @param dto
     */
    async saveInternalTransfer(
        dto: WalletTypings.InternalChain.Api.SaveInternalTransactionReqDto,
    ): Promise<WalletTypings.InternalChain.Api.SaveInternalTransactionResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.SAVE_TRANSFER, dto);
    }

    /**
     * 保存内链交易
     * @param dto
     */
    async saveInternalTransaction(
        dto: WalletTypings.InternalChain.Api.SaveInternalTransactionReqDto,
    ): Promise<WalletTypings.InternalChain.Api.SaveInternalTransactionResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.SAVE_TRANSACTION, dto);
    }

    /**
     * 生成内链交易逻辑对象
     * @param dto
     */
    async createInternalTransObj(dto: WalletTypings.InternalChain.Api.CreateInternalTransObjReqDto): Promise<void> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_TRANS_OBJ, dto);
    }

    /**
     * 获取内链交易
     * @param dto
     */
    async getInternalTrans(dto: WalletTypings.InternalChain.Api.GetInternalTransReqDto): Promise<WalletTypings.InternalChain.Api.GetInternalTransResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_TRANS, dto);
    }

    /**
     * 获取内链账户余额
     * @param dto
     */
    async getInternalAccountBalance(
        dto: WalletTypings.InternalChain.Api.GetInternalAccountBalanceReqDto,
    ): Promise<WalletTypings.InternalChain.Api.GetInternalAccountBalanceResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ACCOUNT_BALANCE, dto);
    }

    /**
     * 更新内链交易状态
     * @param dto
     */
    async updateInternalTransState(
        dto: WalletTypings.InternalChain.Api.UpdateInternalTransStateReqDto,
    ): Promise<WalletTypings.InternalChain.Api.UpdateInternalTransStateResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.UPDATE_TRANS_STATE, dto);
    }

    /**
     * 获取内链的账
     * @param dto
     */
    async getAllAccountAsset(
        dto: WalletTypings.InternalChain.Api.GetInternalAccountsBalanceReqDto,
    ): Promise<WalletTypings.InternalChain.Api.GetInternalAccountsBalanceResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ALL_ACOUNT_BALANCE, dto);
    }

    /**
     * 获取内链资产详情
     * @param dto
     * @returns
     */
    async getAssetDetails(dto: WalletTypings.InternalChain.Api.GetAssetDetailsReqDto): Promise<BFChainWallet.BCF.GetAssetDetailsResp> {
        return await this.__walletNetWorkHelper.get(WALLET_INTERNAL_CHAIN_API_REQUEST.GET_ASSET_DETAILS, dto);
    }

    /**
     * 生成内链投票交易
     * @param dto
     */
    async createInternalVote(dto: WalletTypings.InternalChain.Api.CreateVoteTrReqDto): Promise<WalletTypings.InternalChain.Api.CreateVoteTrResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_INTERNAL_CHAIN_API_REQUEST.CREATE_VOTE_TR, dto);
    }

    /**
     * 上传文件
     * @param dto
     */
    async uploadFile(dto: WalletTypings.InternalChain.Api.UploadFileReqDto): Promise<WalletTypings.InternalChain.Api.UploadFileResDto> {
        return await this.__walletNetWorkHelper.postFile(WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILE, dto);
    }

    /**
     * 批量上传文件
     * @param dto
     */
    async uploadFiles(dto: WalletTypings.InternalChain.Api.UploadFilesReqDto): Promise<WalletTypings.InternalChain.Api.UploadFilesResDto> {
        return await this.__walletNetWorkHelper.postFile(WALLET_INTERNAL_CHAIN_API_REQUEST.UPLOAD_FILES, dto);
    }

    /**
     * 保存人民币交易
     * @param dto
     */
    async saveRmbTransaction(dto: WalletTypings.Rmb.Api.SaveRmbTransactionReqDto): Promise<WalletTypings.Rmb.Api.SaveRmbTransactionResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_RMB_API_REQUEST.SAVE_TRANSACTION, dto);
    }

    /**
     * 生成人民币交易逻辑对象
     * @param dto
     */
    async createRmbTransObj(dto: WalletTypings.Rmb.Api.CreateRmbTransObjReqDto): Promise<void> {
        return await this.__walletNetWorkHelper.post(WALLET_RMB_API_REQUEST.CREATE_TRANS_OBJ, dto);
    }

    /**
     * 获取人民币交易
     * @param dto
     */
    async getRmbTrans(dto: WalletTypings.Rmb.Api.GetRmbTransReqDto): Promise<WalletTypings.Rmb.Api.GetRmbTransResDto> {
        return await this.__walletNetWorkHelper.get(WALLET_RMB_API_REQUEST.GET_TRANS, dto);
    }

    /**
     * 更新人民币交易状态
     * @param dto
     */
    async updateRmbTransState(dto: WalletTypings.Rmb.Api.UpdateRmbTransStateReqDto): Promise<WalletTypings.Rmb.Api.UpdateRmbTransStateResDto> {
        return await this.__walletNetWorkHelper.post(WALLET_RMB_API_REQUEST.UPDATE_TRANS_STATE, dto);
    }

    /**
     * 空投
     * @param dto
     */
    async airdrop(dto: WalletTypings.Airdrop.Api.AirdropReqDto): Promise<WalletTypings.Airdrop.Api.AirdropResDto> {
        const { issueDpInfo, transferDpInfos } = dto;
        dto.issueDpInfo = JSON.stringify(issueDpInfo) as any;
        dto.transferDpInfos = JSON.stringify(transferDpInfos) as any;
        return await this.__walletNetWorkHelper.postFile(WALLET_AIRDROP_API_REQUEST.AIRDROP, dto);
    }
}
