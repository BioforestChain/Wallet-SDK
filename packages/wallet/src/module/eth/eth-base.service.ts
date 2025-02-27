import { $asyncAllNoNullMap, BaseRepository, ExternalChainName, ExternalTransStateID, ExternalTransType, JSBIHelper, Logger } from "@bnqkl/wallet-sdk";
import { API_SCAN_SORT_ENUM } from "../../common/constants";
import { EthTransactions } from "../../common/entity";
import { ExternalChainTransService } from "../external-chain-trans/external-chain-trans.service";
import {
    EthCreateTransReqDto,
    Erc20TransDataReqDto,
    Erc20BalanceReqDto,
    EthSendSignTransReqDto,
    EthSignTransactionReqDto,
    EthTransPrepResDto,
    EthTransPrepReqDto,
    ERC20BalanceItem,
    EthTransHistoryReqDto,
    EthAccountBalanceV2ReqDto,
    EthBrocastDirectNotifyReqDto,
} from "./dto";
import { EthApi } from "@bfmeta/wallet-eth";
import { BscApi } from "@bfmeta/wallet-bsc";

export abstract class EthServiceBase extends ExternalChainTransService {
    abstract repository: BaseRepository<EthTransactions>;

    constructor(public chainName: ExternalChainName.ETH | ExternalChainName.BSC) {
        super(chainName);
    }

    abstract get baseApi(): EthApi | BscApi;

    /**
     * 获取最新区块高度
     */
    protected async __heightGetter(): Promise<number> {
        const blockNumber = await this.baseApi.web3.eth.getBlockNumber();
        return Number(blockNumber);
    }

    /**
     * 获取交易序号
     * @param signTransData
     */
    abstract getNonce(signTransData: string): number;

    /**
     * 创建eth交易
     * @param trJson
     * @param detail
     * @param param
     * @returns
     */
    async createTransaction(
        trJson: WalletTypings.ExternalChain.EthTrJson,
        detail: WalletTypings.ExternalChain.ExternalTransDetail,
        param?: WalletTypings.Entity.BusinessParam,
    ) {
        const trans: EthTransactions = await this.__createTransaction(detail, trJson.txHash, param);
        const nonce = this.getNonce(trJson.signTransData);
        // 暂时不卡nonce了，不然平台账户转账太慢太容易卡住。副作用：并发高会多刷很多201的交易，因为多个nonce一样的交易只有一个能成功
        // if (
        //     await this.repository.findOneBy({
        //         from: detail.from,
        //         nonce,
        //         isBroadcasted: true,
        //         state: In([ExternalTransStateID.waitOnChain, ExternalTransStateID.success]),
        //     })
        // ) {
        //     // 有已广播的相同from和nonce，则不保存，避免用相同的nonce广播造成之前的交易在链上被丢弃
        //     throw new Error(`chainName:${this.chainName} from:${detail.from} nonce:${nonce} is already exist`);
        // }
        trans.fee = detail.fee;
        trans.nonce = nonce;
        trans.trJson = trJson;
        await this.repository.save(trans);
        return trans;
    }

    getLastBlock() {
        return this.baseApi.getLastBlock();
    }

    async getBlock(blockNumber: number): Promise<WalletTypings.Eth.Api.EthGetBlockResDto> {
        const block = await this.baseApi.web3.eth.getBlock(blockNumber);
        return { ...block, timestamp: block.timestamp.toString() };
    }

    getChainId() {
        return this.baseApi.getChainId();
    }

    getBaseGas() {
        return this.baseApi.getBaseGas();
    }

    getContractGas(dto: EthTransPrepReqDto) {
        return this.baseApi.getContractGas(dto.from, dto.to, dto.amount, dto.contractAddress ?? "");
    }

    getGasPrice() {
        return this.baseApi.getGasPrice();
    }

    getBalance(address: string) {
        return this.baseApi.getBalance(address);
    }

    getTransCount(address: string) {
        return this.baseApi.getTransCount(address);
    }

    async getTransPrep(dto: EthTransPrepReqDto) {
        const { from, type } = dto;
        const isContract: boolean = type === ExternalTransType.CONTRACT;
        const [gasPrice, txCount, baseGas] = await Promise.all([this.getGasPrice(), this.getTransCount(from), this.getBaseGas()]);
        const transPrep: EthTransPrepResDto = {
            address: from,
            type,
            gasPrice,
            txCount,
            generalGas: isContract ? 0 : baseGas.generalGas,
            contractGas: isContract ? await this.getContractGas(dto) : 0,
        };
        return transPrep;
    }

    async getContractBalanceAndDecimal(dto: Erc20BalanceReqDto): Promise<WalletTypings.Eth.Api.Erc20BalanceResDto> {
        const { balance, decimal } = await this.baseApi.getContractBalanceAndDecimal(dto.address, dto.contractAddress);
        return { balance, decimal: Number(decimal) };
    }

    getContractTransData(dto: Erc20TransDataReqDto) {
        return this.baseApi.getContractTransData(dto.from, dto.to, dto.amount, dto.contractAddress);
    }

    signTransaction(dto: EthSignTransactionReqDto) {
        return this.baseApi.signTransaction(dto);
    }

    abstract getTxHash(signTransData: string): string;

    async sendSignTrans(dto: EthSendSignTransReqDto) {
        const { signTransData, detail } = dto;
        const txHash = this.getTxHash(signTransData);
        await this.createTransaction({ signTransData, txHash }, detail);
        return txHash;
    }

    getTrans(txHash: string) {
        return this.baseApi.getTrans(txHash);
    }

    async getTransReceipt(txHash: string) {
        const receipt = await this.baseApi.getTransReceiptNative(txHash);
        return receipt ? { ...receipt, blockNumber: Number(receipt.blockNumber) } : null;
    }

    /**
     * 检查是否过期
     * @param trans
     */
    async checkExpire(trans: EthTransactions): Promise<boolean> {
        const { from, nonce } = trans;
        const txCount = await this.getTransCount(from);
        return txCount > nonce;
    }

    getNormalTransHistory(dto: EthTransHistoryReqDto) {
        if (!dto?.sort) {
            dto.sort = API_SCAN_SORT_ENUM.DESC;
        }
        return this.baseApi.getNormalTransHistory(dto);
    }

    async getAccountBalanceV2(dto: EthAccountBalanceV2ReqDto): Promise<ERC20BalanceItem[]> {
        const { address, contracts } = dto;
        // 获取合约列表信息
        const tokenMap = await this.__contractTokenInfoService.getTokenInfoMap(this.chainName);
        const result = await $asyncAllNoNullMap(contracts, async (contractAddress) => {
            const token = tokenMap.get(contractAddress.toLowerCase());
            if (!token) {
                Logger.warn(`getAccountBalanceV2 not found contract chainName:${this.chainName}, address:${address}, contractAddress:${contractAddress}`);
                return;
            }
            const balance = await this.baseApi.getContractBalance(address, contractAddress);
            const item: ERC20BalanceItem = {
                contractAddress: contractAddress,
                amount: balance,
                symbol: token.symbol,
                decimals: token.decimals,
                icon: token.icon,
            };
            return item;
        });
        return result;
    }

    async createTrans(dto: EthCreateTransReqDto) {
        const txCount = await this.getTransCount(dto.from);
        const gasPrice = await this.getGasPrice();
        const generalGas = (await this.getBaseGas()).generalGas;
        const txObject = {
            from: dto.from,
            to: dto.to,
            value: dto.amount,
            gas: generalGas,
            gasPrice: gasPrice,
            nonce: txCount,
        };
        const signReq: EthSignTransactionReqDto = {
            trans: txObject,
            privateKey: dto.privateKey,
        };
        const { rawTrans } = await this.signTransaction(signReq);
        const signTrans = {
            signTransData: rawTrans,
            detail: {
                from: dto.from,
                to: dto.to,
                amount: dto.amount,
                fee: "0",
                assetSymbol: dto.assetSymbol,
            },
        };

        return await this.sendSignTrans(signTrans);
    }

    async createContractTrans(dto: EthCreateTransReqDto) {
        const txCount = await this.getTransCount(dto.from);
        const gasPrice = await this.getGasPrice();
        const contractGas = (await this.getBaseGas()).contractGas;

        const dataReq: Erc20TransDataReqDto = {
            from: dto.from,
            to: dto.to,
            amount: dto.amount,
            contractAddress: dto.contract,
        };
        const data = await this.getContractTransData(dataReq);
        const contracObjact = {
            from: dto.from,
            to: dto.contract,
            value: 0,
            gas: contractGas,
            gasPrice: gasPrice,
            nonce: txCount,
            data: data,
        };
        const signReq: EthSignTransactionReqDto = {
            trans: contracObjact,
            privateKey: dto.privateKey,
        };
        const { rawTrans } = await this.signTransaction(signReq);
        const signTrans = {
            signTransData: rawTrans,
            detail: {
                from: dto.from,
                to: dto.to,
                amount: dto.amount,
                fee: "0",
                assetSymbol: dto.assetSymbol,
            },
        };
        return await this.sendSignTrans(signTrans);
    }

    /**
     * 获取外链交易手续费信息
     * @param txId
     * @returns
     */
    async getTransFeeInfo(txId: string): Promise<WalletTypings.ExternalChain.EthTransFeeInfo | undefined> {
        const trans = (await this.repository.findOneByForce({ entityId: txId })) as EthTransactions;
        const { txHash, state } = trans;
        if (state !== ExternalTransStateID.SUCCESS) {
            return;
        }
        // 已上链，交易手续费信息
        const receipt = await this.getTransReceipt(txHash);
        if (!receipt) {
            throw Error(`txHash:${txHash} getTransReceipt fail`);
        }
        const { effectiveGasPrice, gasUsed } = receipt;
        return { gasPrice: effectiveGasPrice, gasUsed };
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
    ): Promise<EthTransactions> {
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
    ): Promise<WalletTypings.ExternalChain.EthTrJson> {
        const { privateKey, address: from } = account;
        const transType = contractAddress ? ExternalTransType.CONTRACT : ExternalTransType.COMMON;
        const { gasPrice, txCount, generalGas, contractGas } = await this.getTransPrep({
            from,
            to: recipientId,
            amount,
            type: transType,
            contractAddress,
        });
        // gasPrice在[100%, 110%]区间内随机，保证txHash不相同
        const randomFactor = 1 + Math.random() * 0.1;
        const gasPriceRatio = JSBIHelper.toFraction(randomFactor.toString());
        if (contractAddress) {
            const { rawTrans, txHash } = await this.signTransaction({
                trans: {
                    from,
                    to: contractAddress,
                    nonce: txCount,
                    value: "0",
                    gasPrice: ((BigInt(gasPrice) * BigInt(gasPriceRatio.numerator)) / BigInt(gasPriceRatio.denominator)).toString(),
                    gas: contractGas,
                    data: await this.getContractTransData({
                        from,
                        to: recipientId,
                        amount,
                        contractAddress,
                    }),
                },
                privateKey,
            });
            return { signTransData: rawTrans, txHash };
        } else {
            const { rawTrans, txHash } = await this.signTransaction({
                trans: {
                    from,
                    to: recipientId,
                    nonce: txCount,
                    value: amount,
                    gasPrice: ((BigInt(gasPrice) * BigInt(gasPriceRatio.numerator)) / BigInt(gasPriceRatio.denominator)).toString(),
                    gas: generalGas,
                },
                privateKey,
            });
            return { signTransData: rawTrans, txHash };
        }
    }

    async sdkBroadcastTransaction(trJson: Pick<WalletTypings.ExternalChain.EthTrJson, "signTransData">) {
        const txHash = await this.baseApi.sendSignedTransaction(trJson.signTransData);
        return txHash;
    }

    async sdkBroadcastTransactionNotify(dto: EthBrocastDirectNotifyReqDto) {
        const { fromAddress, toAddress, amount, trsInfo, notifyUrl } = dto;
        this.notifyService.checkNotifyParam(dto, this.chainName);
        const txHash = await this.baseApi.sendSignedTransaction(trsInfo.info.trs);
        if (notifyUrl) {
            await this.notifyService.saveNotify(
                {
                    chainName: this.chainName,
                    trSignature: txHash,
                    notifyUrl,
                    fromAddress,
                    toAddress,
                    amount,
                },
                dto.customParamString,
            );
        }

        return txHash;
    }
}
