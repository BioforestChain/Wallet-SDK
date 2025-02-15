import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import {
    ContractFunctionEnum,
    TronCreateTransDto,
    TRC20TransactionDto,
    TriggerSmartContractDto,
    TronTransactionDto,
    TronBaseReqDto,
    TronAccountResDto,
    Trc20BalanceResDto,
    TronBalanceReqDto,
    TronBlockResDto,
    TRC20BalanceItem,
    TronTransHistoryReqDto,
    TronAccountBalanceV2ReqDto,
    Trc20ContractReqDto,
    Trc20ContractResDto,
    TronSendTrxDto,
    TronSendTrc20Dto,
    TronTransBodyDto,
    Trc20TransBodyDto,
    TronBroadcastTrxReqDto,
    TronBroadcastTrc20ReqDto,
    TRC20TransactionNotifyDto,
} from "./dto";
import { TronTransactions } from "../../common/entity";
import { ExternalChainTransService } from "../external-chain-trans/external-chain-trans.service";
import { $asyncAllNoNullMap, BaseRepository, ExternalChainName, ExternalTransStateID, regSpace } from "@bnqkl/wallet-sdk";
import { walletSdk } from "../../helper";

@Injectable()
export class TronTransactionRepository extends BaseRepository<TronTransactions> {
    constructor(dataSource: DataSource) {
        super(TronTransactions, dataSource);
    }
}

@Injectable()
export class TronService extends ExternalChainTransService {
    @Inject(TronTransactionRepository)
    public readonly repository: TronTransactionRepository;

    constructor() {
        super(ExternalChainName.TRON);
    }

    get baseApi() {
        return walletSdk.walletFactory.TronApi;
    }

    newTransaction() {
        return new TronTransactions();
    }

    /**
     * 获取最新区块高度
     */
    protected async __heightGetter(): Promise<number> {
        const block = await this.baseApi.getCurrentBlock();
        return block.block_header.raw_data.number;
    }

    /**
     * 创建tron交易
     * @param trJson
     * @param detail
     * @param param
     * @returns
     */
    async createTransaction(
        trJson: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction,
        detail: WalletTypings.ExternalChain.ExternalTransDetail,
        param?: WalletTypings.Entity.BusinessParam,
    ) {
        const trans: TronTransactions = await this.__createTransaction(detail, trJson.txID, param);
        const { detail: exclude, ...savedTrJson } = trJson as any;
        trans.trJson = savedTrJson;
        await this.repository.save(trans);
        return trans;
    }

    /**
     * 获取波场最新区块
     * @returns {TronBlockResDto} tron block
     */
    async getNowBlock(): Promise<TronBlockResDto> {
        const block = await this.baseApi.getCurrentBlock();
        const res: TronBlockResDto = {
            blockID: block?.blockID,
            number: block?.block_header?.raw_data?.number,
        };
        return res;
    }

    /**
     * 获取指定地址的用户信息
     * @param {TronBaseReqDto} dto dto
     * @returns  {TronAccountResDto} tron account
     */
    async getAccount(dto: TronBaseReqDto): Promise<TronAccountResDto> {
        const result = await this.baseApi.getAccount(dto.address);
        const tronAccount = new TronAccountResDto();
        tronAccount.active = false;
        if (result) {
            tronAccount.active = true;
            tronAccount.account = {
                address: result.address.base58,
                addressHex: result.address.hex,
                balance: result.balance,
            };
        }
        return tronAccount;
    }

    /**
     * 获取指定地址的合约余额
     * @param {Trc20ContractReqDto} dto dto
     * @returns {string} contract balance
     */
    async getContractBalance(dto: Trc20ContractReqDto): Promise<string> {
        const { address, contract } = dto;
        return await this.baseApi.getContractBalance(address, contract);
    }

    /**
     * 获取指定地址的合约精度
     * @param {Trc20ContractReqDto} dto dto
     * @returns {number} contract decimal
     */
    async getContractDecimal(dto: Trc20ContractReqDto): Promise<number> {
        return await this.baseApi.getContractDecimal(dto.contract);
    }

    /**
     * 获取指定地址的合约信息
     * @param {Trc20ContractReqDto} dto dto
     * @returns {Trc20ContractResDto} contract balance & decimal
     */
    async getContract(dto: Trc20ContractReqDto): Promise<Trc20ContractResDto> {
        const balance = await this.getContractBalance(dto);
        const decimal = await this.getContractDecimal(dto);
        const res: Trc20ContractResDto = {
            balance: balance,
            decimal: decimal,
        };
        return res;
    }

    /**
     * 获取指定地址的 TRX 余额
     * @param {TronBaseReqDto} dto
     * @returns {string} trx balance
     */
    async getTrxBalance(dto: TronBaseReqDto): Promise<string> {
        return await this.baseApi.getTrxBalance(dto.address);
    }

    /**
     * 发起TRX交易
     * @param {TronSendTrxDto} dto dto
     * @returns {TronTransBodyDto} trx trans body
     */
    async sendTrx(dto: TronSendTrxDto): Promise<TronTransBodyDto> {
        return await this.baseApi.sendTrx(dto);
    }

    /**
     * 发起Trc20合约交易
     * @param {TronSendTrc20Dto} dto dto
     * @returns {Trc20TransBodyDto} trc20 trans body
     */
    async sendTrc20(dto: TronSendTrc20Dto): Promise<Trc20TransBodyDto> {
        return await this.baseApi.sendTrc20(dto);
    }

    /**
     * TRX交易签名
     * @param transBody TRX交易体
     * @param privateKey 私钥
     * @returns {TronTransBodyDto} 携带signature签名的交易体
     */
    async signTrx(transBody: TronTransBodyDto, privateKey: string): Promise<TronTransBodyDto> {
        return await this.baseApi.signTrx(transBody, privateKey);
    }

    /**
     * TRC20合约交易签名
     * @param transBody TRC20合约交易体
     * @param privateKey 私钥
     * @returns {Trc20TransBodyDto} 携带signature签名的交易体
     */
    async signTrc20(transBody: Trc20TransBodyDto, privateKey: string): Promise<Trc20TransBodyDto> {
        return await this.baseApi.signTrc20(transBody, privateKey);
    }

    async broadcast(signTrans: TronTransBodyDto | Trc20TransBodyDto): Promise<BFChainWallet.TRON.BroadcastRes> {
        return await this.baseApi.broadcast(signTrans);
    }

    async broadcastTrx(dto: TronBroadcastTrxReqDto) {
        const result = await this.broadcast(dto.transBody);
        if (!result.result) {
            // 广播失败后，手动抛出错误
            throw new Error(result.message);
        }
        await this.saveTrans(result.txid, dto);
        return result;
    }

    async broadcastTrc20(dto: TronBroadcastTrc20ReqDto) {
        const result = await this.broadcast(dto.transBody);
        if (!result.result) {
            // 广播失败后，手动抛出错误
            throw new Error(result.message);
        }

        await this.saveTrans(result.txid, dto);
        return result;
    }

    async saveTrans(txId: string, trans: TronBroadcastTrxReqDto | TronBroadcastTrc20ReqDto) {
        const transBody = await this.baseApi.getTransBody(trans.transBody);
        const { from, to, amount, contractAddress } = transBody;
        const fee = trans.estimateFee ?? "0";
        let assetSymbol: string;
        if (contractAddress) {
            // 获取token
            const contract = await this.__contractTokenInfoService.getContractInfoForce(this.chainName, contractAddress);
            assetSymbol = contract.symbol;
        } else {
            assetSymbol = "TRX";
        }
        const transDetail: WalletTypings.ExternalChain.ExternalTransDetail = {
            from,
            to,
            amount,
            fee,
            assetSymbol,
            contract: contractAddress,
        };
        try {
            const entity: TronTransactions = await this.__createTransaction(transDetail, txId);
            /** @TODO 波场全部修改时再修改对应的类型  */
            // entity.extra = trans.transBody;
            await this.repository.save(entity);
            return entity;
        } catch (error) {
            // 二次广播可能会重复创建导致异常，直接忽略
        }
    }

    async getAccountResource(dto: TronBaseReqDto) {
        return await this.baseApi.getAccountResources(dto.address);
    }

    async createTronTransaction(dto: TronCreateTransDto) {
        return await this.baseApi.createTransaction(dto);
    }

    async triggerSmartContract(dto: TriggerSmartContractDto) {
        const f_selector = dto.function_selector;
        if (f_selector) {
            // 需额外去除所有空格
            dto.function_selector = f_selector.replace(regSpace, "");
        }
        return await this.baseApi.triggerSmartContract(dto);
    }

    async broadcastTronTransaction(dto: TronTransactionDto | TRC20TransactionDto) {
        const result = await this.baseApi.broadcastTransaction(dto);
        // 错误特殊处理：业务错误不会直接抛出异常，需要额外添加判断
        if (result?.code && result?.message) {
            throw new Error(result.code);
        }
        // 二次保护，确定有详情信息的为首次广播
        if (result?.result) {
            // 保存交易信息
            await this.createTransaction(dto, dto.detail);
        }
        return result;
    }

    async getTRC20Balance(dto: TronBalanceReqDto) {
        const contract = new TriggerSmartContractDto();
        contract.owner_address = dto.owner_address;
        contract.contract_address = dto.contract_address;
        contract.function_selector = ContractFunctionEnum.balance;
        contract.input = dto.visible ? [{ type: "address", value: dto.hex_address as string }] : [{ type: "address", value: dto.owner_address }];
        contract.visible = dto.visible;
        // 获取合约余额
        const result = await this.baseApi.triggerSmartContract(contract);
        return result ? Number(result.constant_result_decode) : 0;
    }

    async getTRC20Decimal(dto: TronBalanceReqDto) {
        const contract = new TriggerSmartContractDto();
        contract.owner_address = dto.owner_address;
        contract.contract_address = dto.contract_address;
        contract.function_selector = ContractFunctionEnum.decimal;
        contract.input = dto.visible ? [{ type: "address", value: dto.hex_address as string }] : [{ type: "address", value: dto.owner_address }];
        contract.visible = dto.visible;
        // 获取合约精度
        const result = await this.baseApi.triggerSmartContract(contract);
        return result ? Number(result.constant_result_decode) : 0;
    }

    async getContractBalanceAndDecimal(dto: TronBalanceReqDto) {
        const result = new Trc20BalanceResDto();
        result.owner_address = dto.owner_address;
        result.contract_address = dto.contract_address;
        // 查询合约余额
        const balance = await this.getTRC20Balance(dto);
        result.balance = balance;
        if (balance > 0) {
            // 查询合约精度
            const decimal = await this.getTRC20Decimal(dto);
            result.decimal = decimal;
        }
        return result;
    }

    getCommonTransHistory(dto: TronTransHistoryReqDto) {
        return this.baseApi.getCommonTransHistory(dto);
    }

    getTrc20TransHistory(dto: TronTransHistoryReqDto) {
        return this.baseApi.getTrc20TransHistory(dto);
    }

    async getAccountBalanceV2(dto: TronAccountBalanceV2ReqDto) {
        const { address, contracts } = dto;
        // 获取合约列表信息
        const tokenMap = await this.__contractTokenInfoService.getTokenInfoMap(this.chainName);
        const result = await $asyncAllNoNullMap(contracts, async (contractAddress) => {
            const balance = await this.baseApi.getContractBalance(address, contractAddress);
            const token = tokenMap.get(contractAddress.toLowerCase());
            if (token) {
                const item = new TRC20BalanceItem();
                item.contractAddress = contractAddress;
                item.amount = balance;
                item.symbol = token.symbol;
                item.decimals = token.decimals;
                item.icon = token.icon;
                return item;
            }
        });
        return result;
    }

    async getTransReceipt(txHash: string) {
        try {
            return await this.baseApi.getTransReceipt(txHash);
        } catch (e) {
            // 波场未上链时一直抛异常，不打印
        }
    }

    getTransactionInfoById(txId: string) {
        return this.baseApi.getTransactionInfoById(txId);
    }

    /**
     * 获取外链交易手续费信息
     * @param txId
     * @returns
     */
    async getTransFeeInfo(txId: string): Promise<WalletTypings.ExternalChain.TronTransFeeInfo | undefined> {
        const trans = await this.repository.findOneByForce({ entityId: txId });
        const { txHash, state } = trans;
        if (state !== ExternalTransStateID.SUCCESS) {
            return;
        }
        // 已上链，交易手续费信息
        const receipt = await this.getTransReceipt(txHash);
        if (!receipt) {
            throw Error(`txHash:${txHash} getTransReceipt fail`);
        }
        const { fee, netFee, netUsage, energyFee, energyUsage, energyUsageTotal, originEnergyUsage } = receipt;
        return { fee, netFee, netUsage, energyFee, energyUsage, energyUsageTotal, originEnergyUsage };
    }

    /**
     * 创建转账交易
     * @param account
     * @param detail
     * @param param
     * @returns
     */
    async createTransferTransaction(
        account: WalletTypings.ExternalChain.WalletAccount,
        detail: WalletTypings.ExternalChain.ExternalTransDetail & { contract?: string },
        param?: WalletTypings.Entity.BusinessParam,
    ): Promise<TronTransactions> {
        detail.from = await walletSdk.walletFactory.TronApi.addressToHex(detail.from);
        // 预先生成交易体
        const trJson = await this.generateTransferTrJson(account, detail.to, detail.amount, detail.contract);
        // 创建链上交易
        return await this.createTransaction(trJson, detail, param);
    }

    /**
     * 生成转账交易体
     * @param account
     * @param recipientId
     * @param amount
     * @param contractAddress
     * @returns
     */
    async generateTransferTrJson(
        account: WalletTypings.ExternalChain.WalletAccount,
        recipientId: string,
        amount: string,
        contractAddress?: string,
    ): Promise<BFChainWallet.TRON.Trc20Transaction | BFChainWallet.TRON.TronTransaction> {
        const tronApi = walletSdk.walletFactory.TronApi;
        const { privateKey, address } = account;
        const from = await tronApi.addressToHex(address);
        if (contractAddress) {
            const dto: TronSendTrc20Dto = {
                from,
                to: recipientId,
                amount,
                contractAddress,
            };
            // 创建交易
            const trc20Trans = await this.sendTrc20(dto);
            // 交易签名
            if (!trc20Trans) {
                throw new Error(`创建交易失败 dto:${dto}`);
            }
            const transWithSign = await this.signTrc20(trc20Trans, privateKey.substring(2));
            return transWithSign;
        } else {
            const dto: TronSendTrxDto = {
                from,
                to: recipientId,
                amount,
            };
            // 创建交易
            const trxTrans = await this.sendTrx(dto);
            // 交易签名
            if (!trxTrans) {
                throw new Error(`创建交易失败 dto:${dto}`);
            }
            const transWithSign = await this.signTrx(trxTrans, privateKey.substring(2));
            return transWithSign;
        }
    }

    async sdkBroadcastTransaction(trJson: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction) {
        const result = await this.baseApi.broadcastTransaction(trJson);
        return result.txid;
    }

    async sdkBroadcastTransactionNotify(dto: TRC20TransactionNotifyDto) {
        const { fromAddress, toAddress, amount, trsInfo, notifyUrl } = dto;
        this.notifyService.checkNotifyParam(dto);
        const result = await this.baseApi.broadcastTransaction(trsInfo.info.trs);
        if (notifyUrl) {
            await this.notifyService.saveNotify({
                chainName: this.chainName,
                trSignature: result.txid,
                notifyUrl,
                fromAddress,
                toAddress,
                amount,
            });
        }
        return result.txid;
    }

    /**
     * 获取余额
     * @param  {string} address
     * @returns {string} balance
     */
    async getBalance(address: string): Promise<string> {
        return await this.baseApi.getTrxBalance(address);
    }
}
