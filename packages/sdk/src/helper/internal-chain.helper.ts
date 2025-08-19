import { InternalChainName } from "@bnqkl/wallet-typings";
import type { WalletSDK } from "../core/index.js";

export class InternalChainHelper {
    private __walletSdk: WalletSDK;
    constructor(walletSdk: WalletSDK) {
        this.__walletSdk = walletSdk;
    }

    /**
     * 检查是否为业务层支持转账的内链名
     * @param chainName
     */
    static checkBusinessInternalName(chainName: InternalChainName) {
        switch (chainName) {
            case InternalChainName.PMCHAIN:
            case InternalChainName.ETHMETA:
                return;
            default:
                break;
        }
        throw new Error(`checkBusinessInternalName error. chainName:${chainName}`);
    }

    /**
     * 是否为生物链林地址
     * @param address
     */
    async isBCFAddress(address: string) {
        return await this.__walletSdk.bfmetaSignUtil.isAddress(address);
    }

    async isBCFValidSignature(message: string, signature: string, options: WalletServerSdk.Trans.Options) {
        const { address, publicKey } = options;
        if (!address) {
            return false;
        }
        if (!publicKey) {
            return false;
        }
        const calcAddress = await this.__walletSdk.bfmetaSignUtil.getAddressFromPublicKeyString(publicKey);
        if (calcAddress !== address) {
            return false;
        }
        return await this.__walletSdk.bfmetaSignUtil.detachedVeriy(
            new Uint8Array(Buffer.from(message)),
            new Uint8Array(Buffer.from(signature, "hex")),
            new Uint8Array(Buffer.from(publicKey, "hex")),
        );
    }

    /**
     * 获取转账交易详情
     * @param chainName
     * @param transactionJSON
     * @returns
     */
    getTransferTransDetail(
        chainName: InternalChainName,
        transactionJSON: WalletTypings.InternalChain.TransferAssetTransaction,
    ): WalletTypings.InternalChain.TransDetail {
        const { signature, senderId, recipientId, asset } = transactionJSON;
        return {
            chainName,
            from: senderId,
            to: recipientId,
            amount: asset.transferAsset.amount,
            assetType: asset.transferAsset.assetType,
            txHash: signature,
        };
    }

    /**
     * 获取销毁权益交易详情
     * @param chainName
     * @param transactionJSON
     * @returns
     */
    getDestroyAssetTransDetail(
        chainName: InternalChainName,
        transactionJSON: WalletTypings.InternalChain.DestroyAssetTransaction,
    ): WalletTypings.InternalChain.TransDetail {
        const { signature, senderId, recipientId, asset } = transactionJSON;
        return {
            chainName,
            from: senderId,
            to: recipientId,
            amount: asset.destroyAsset.amount,
            assetType: asset.destroyAsset.assetType,
            txHash: signature,
        };
    }
}
