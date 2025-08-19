import { compareTwoStrLowerCase } from "@bnqkl/server-util";
import type { WalletSDK } from "../core/index.js";
import { ExternalChainName, TOKEN_TO_BEN } from "@bnqkl/wallet-typings";

export class ExternalChainHelper {
    private __walletSdk: WalletSDK;
    constructor(walletSdk: WalletSDK) {
        this.__walletSdk = walletSdk;
    }

    private __verifyTransfer(txData: string) {
        /**
         * @FIXME
         * 合约转账，目前不知道怎么将 a9059cbb 解析成 transfer 就先这样写
         * 在 this.__findTransferAbi 这个函数中查询转账合约的abi，然后同个input去解析出参数
         */
        if (!compareTwoStrLowerCase(txData, "a9059cbb")) {
            throw new Error(`invaild txData ${txData}`);
        }
    }

    /**
     * 获取eth交易的nonce
     * @param ethSendSign
     * @returns
     */
    getEthNonce(ethSendSign: string): number {
        const ethApi = this.__walletSdk.walletFactory.EthApi;
        let nonce: string = "";
        try {
            const tx = ethApi.getEIP1559TransactionFromSignature(ethSendSign);
            nonce = tx.nonce.toString();
        } catch (error) {
            const tx = ethApi.getTransactionFromSignature(ethSendSign);
            nonce = tx.nonce.toString("hex");
        }
        if (!nonce) {
            return 0;
        }
        return parseInt(nonce, 16);
    }

    getEthTransDetail(ethSendSign: string): WalletTypings.ExternalChain.TransDetail {
        const ethApi = this.__walletSdk.walletFactory.EthApi;
        let transBody: BFChainWallet.ETH.EthTransBodyFromSign | null;
        try {
            transBody = ethApi.getEIP1559TransBodyFromSignature(ethSendSign);
        } catch (error) {
            transBody = ethApi.getTransBodyFromSignature(ethSendSign);
        }
        if (!transBody) {
            throw new Error(`getEthTransDetail error, ethSendSign: ${ethSendSign}`);
        }

        return {
            chainName: ExternalChainName.ETH,
            from: transBody.from,
            to: transBody.to,
            amount: transBody.value,
            contractAddress: transBody.contractAddress ?? "",
            txHash: transBody.hash,
        };
    }

    /**
     * 获取bsc交易的nonce
     * @param bscSendSign
     * @returns
     */
    getBscNonce(bscSendSign: string): number {
        const bscApi = this.__walletSdk.walletFactory.BscApi;
        const tx = bscApi.getTransactionFromSignature(bscSendSign);
        const nonce = tx.nonce.toString("hex");
        if (!nonce) {
            return 0;
        }
        return parseInt(nonce, 16);
    }

    getBscTransDetail(bscSendSign: string): WalletTypings.ExternalChain.TransDetail {
        const bscApi = this.__walletSdk.walletFactory.BscApi;
        const transBody = bscApi.getTransBodyFromSignature(bscSendSign);
        if (!transBody) {
            throw new Error(`getBscTransDetail error, bscSendSign: ${bscSendSign}`);
        }
        return {
            chainName: ExternalChainName.BSC,
            from: transBody.from,
            to: transBody.to,
            amount: transBody.value,
            contractAddress: transBody.contractAddress ?? "",
            txHash: transBody.hash,
        };
    }

    async getTronTransDetail(
        tronTrans: BFChainWallet.TRON.Trc20Transaction | BFChainWallet.TRON.TronTransaction,
    ): Promise<WalletTypings.ExternalChain.TransDetail> {
        const tronApi = this.__walletSdk.walletFactory.TronApi;
        const transBody = await tronApi.getTransBody(tronTrans);
        const { from, to, amount, contractAddress } = transBody;
        return {
            chainName: ExternalChainName.TRON,
            from,
            to,
            amount,
            contractAddress,
            txHash: tronTrans.txID,
        };
    }

    /**根据合约号转精度，转成我们生物链林的精度 就是小数点后八位 */
    static transformDecimalToBCF(decimal: number, amount: string) {
        return (BigInt(amount) * TOKEN_TO_BEN) / BigInt(10 ** decimal);
    }

    /**根据生物链林的精度，转成合约号转精度 */
    static transformDecimalToContract(decimal: number, amount: string) {
        return (BigInt(amount) * BigInt(10 ** decimal)) / TOKEN_TO_BEN;
    }

    /**
     * 精度转换
     * @param fromDecimal
     * @param toDecimal
     * @param amount
     * @returns
     */
    static transformDecimal(fromDecimal: number, toDecimal: number, amount: string) {
        return (BigInt(amount) * BigInt(10 ** toDecimal)) / BigInt(10 ** fromDecimal);
    }

    /**
     * convert tron address to base58 & hex
     * @param address tron address base58 or hex
     * @returns tron address base58 and hex
     */
    convertTronAddress(address: string): { base58: string; hex: string } {
        const tronApi = this.__walletSdk.walletFactory.TronApi;
        const hex = tronApi.tronWeb.address.toHex(address);
        const base58 = tronApi.tronWeb.address.fromHex(hex);
        return { base58, hex };
    }

    /**
     * 获取外链交易的分布式锁的key
     * @param chainName
     * @param address
     */
    static getExternalTransLockKey(chainName: ExternalChainName, address: string) {
        return `externalTransLock:${chainName}:${address}`;
    }

    /**
     * 是否是以太坊的地址
     * @param address
     * @returns
     */
    isEthAddress(address: string) {
        return this.__walletSdk.walletFactory.EthApi.web3.utils.isAddress(address);
    }

    /**
     * 是否是波场的地址
     * @param address
     * @returns
     */
    isTronAddress(address: string) {
        return this.__walletSdk.walletFactory.TronApi.tronWeb.isAddress(address);
    }

    /**
     * 波场通过hex地址获取base58格式地址
     * @param addressHex
     * @returns
     */
    getTronAddressFromHex(addressHex: string) {
        return this.__walletSdk.walletFactory.TronApi.tronWeb.address.fromHex(addressHex);
    }

    isETHValidSignature(message: string, signature: string, options: WalletServerSdk.Trans.Options) {
        if (!options.address) {
            return false;
        }
        const address = this.__walletSdk.walletFactory.EthApi.web3.eth.accounts.recover(message, signature);
        return compareTwoStrLowerCase(address, options.address);
    }

    async isTronValidSignature(message: string, signature: string, options: WalletServerSdk.Trans.Options) {
        if (!options.address) {
            return false;
        }
        const address = await this.__walletSdk.walletFactory.TronApi.verifyMessageV2(this.__walletSdk.walletFactory.TronApi.tronWeb.toHex(message), signature);
        const addressHex = await this.__walletSdk.walletFactory.TronApi.addressToHex(address);
        return compareTwoStrLowerCase(addressHex, options.address);
    }
}
