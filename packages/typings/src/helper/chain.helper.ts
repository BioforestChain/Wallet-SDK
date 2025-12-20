import { ExternalChainName, ExternalMainAssetType, ExternalMainAssetDecimal } from "../external-chain";
import { InternalChainName, InternalMainAssetType, WALLET_BCF_API_REQUEST } from "../internal-chain";

export class ChainHelper {
    /**
     * 获取外链主币种名
     * @param chainName
     */
    static getExternalMainAssetType(chainName: ExternalChainName): ExternalMainAssetType {
        switch (chainName) {
            case ExternalChainName.ETH:
                return ExternalMainAssetType.ETH;
            case ExternalChainName.BSC:
                return ExternalMainAssetType.BNB;
            case ExternalChainName.TRON:
                return ExternalMainAssetType.TRX;
            default:
                throw Error(`getExternalMainAssetType error. chainName:${chainName}`);
        }
    }

    /**
     * 获取外链主币种精度
     * @param chainName
     */
    static getExternalMainAssetDecimal(chainName: ExternalChainName): ExternalMainAssetDecimal {
        switch (chainName) {
            case ExternalChainName.ETH:
                return ExternalMainAssetDecimal.ETH;
            case ExternalChainName.BSC:
                return ExternalMainAssetDecimal.BNB;
            case ExternalChainName.TRON:
                return ExternalMainAssetDecimal.TRX;
            default:
                throw Error(`getExternalMainAssetDecimal error. chainName:${chainName}`);
        }
    }

    /**
     * 获取内链主币种名
     * @param chainName
     * @param isTestnet
     */
    static getInternalMainAssetType(chainName: InternalChainName, isTestnet: boolean): InternalMainAssetType {
        switch (chainName) {
            case InternalChainName.BFCHAINV2:
                return InternalMainAssetType.BFT;
            case InternalChainName.BFMCHAIN:
                return isTestnet ? InternalMainAssetType.BFMTEST : InternalMainAssetType.BFM;
            case InternalChainName.CCCHAIN:
                return InternalMainAssetType.CCC;
            case InternalChainName.PMCHAIN:
                return InternalMainAssetType.PMC;
            case InternalChainName.ETHMETA:
                return InternalMainAssetType.ETHM;
            case InternalChainName.BTGMETA:
                return InternalMainAssetType.BTGM;
            case InternalChainName.BIWMETA:
                return InternalMainAssetType.BIW;
            case InternalChainName.BFMETAV2:
                return InternalMainAssetType.BFM;
            default:
                throw Error(`getInternalMainAssetType error. chainName:${chainName}`);
        }
    }

    /**
     * 获取内链路由
     * @param chainName
     * @returns
     */
    static getBcfPath(chainName: InternalChainName, path: WALLET_BCF_API_REQUEST) {
        return `/${this.getBcfPathPrefix(chainName)}${path}`;
    }

    /**
     * 获取内链路由前缀
     * @param chainName
     * @returns
     */
    static getBcfPathPrefix(chainName: InternalChainName) {
        if (chainName === InternalChainName.BFMCHAIN) {
            return "bfm";
        }
        return chainName.toLowerCase();
    }
}
