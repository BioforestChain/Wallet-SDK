import * as fs from "fs";
import { WalletFactory } from "@bfmeta/wallet";
import { BCFApi } from "@bfmeta/wallet-bcf";
import { LoggerSymbol } from "@bfmeta/wallet-helpers";
import { ModuleStroge } from "@bnqkl/util-node";
import { BFMetaSignUtil } from "@bfmeta/sign-util";
import { CryptoHelper } from "../helper/crypto.helper";
import { Logger } from "@bnqkl/server-util";
import { InternalChainName } from "@bnqkl/wallet-typings";

const ccchainBlackAddressListPath = process.cwd() + "/config/ccchainBlackAddressList.json";
const blackAddressList: string[] = fs.existsSync(ccchainBlackAddressListPath) ? require(ccchainBlackAddressListPath) : [];
const set = new Set<string>();
try {
    for (const address of blackAddressList) {
        set.add(address.substring(1));
    }
} catch (err) {
    console.log(err);
}
export class WalletSDK {
    __walletFactory: WalletFactory;
    get walletFactory() {
        if (this.__walletFactory) {
            return this.__walletFactory;
        } else {
            if (!this.config) {
                throw new Error(`can not find config of chain`);
            }
            const moduleMap = new ModuleStroge();
            moduleMap.set(LoggerSymbol, Logger);
            this.__walletFactory = new WalletFactory(this.__getConfigForce(), moduleMap);
            return this.__walletFactory;
        }
    }
    private __getConfigForce() {
        if (!this.config) {
            throw new Error(`can not find config of chain`);
        }
        return this.config;
    }
    bfmetaSignUtil: MyBFMetaSignUtil;
    constructor(prefix: string, public config?: BFChainWallet.Config) {
        if (this.config) {
            this.walletFactory;
        }
        this.bfmetaSignUtil = new MyBFMetaSignUtil(prefix, Buffer as any, new CryptoHelper());
    }

    private __BFMApi!: BCFApi;
    private __CCChainApi!: BCFApi;
    private __PMChainApi!: BCFApi;
    private __ETHMChainApi!: BCFApi;
    private __BFCHAINV2Api!: BCFApi;
    private __BTGMChainApi!: BCFApi;
    private __BTCMChainApi!: BCFApi;
    private __BIWMChainApi!: BCFApi;
    private __MalibuApi!: BCFApi;
    get BFMApi() {
        if (this.__BFMApi) {
            return this.__BFMApi;
        } else {
            this.__BFMApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["bfm"]);
            return this.__BFMApi;
        }
    }
    get CCChainApi() {
        if (this.__CCChainApi) {
            return this.__CCChainApi;
        } else {
            this.__CCChainApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["ccchain"]);
            return this.__CCChainApi;
        }
    }
    get PMChainApi() {
        if (this.__PMChainApi) {
            return this.__PMChainApi;
        } else {
            this.__PMChainApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["pmchain"]);
            return this.__PMChainApi;
        }
    }
    get ETHMChainApi() {
        if (this.__ETHMChainApi) {
            return this.__ETHMChainApi;
        } else {
            this.__ETHMChainApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["ethm"]);
            return this.__ETHMChainApi;
        }
    }
    get BFCHAINV2Api() {
        if (this.__BFCHAINV2Api) {
            return this.__BFCHAINV2Api;
        } else {
            this.__BFCHAINV2Api = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["bfchainv2"]);
            return this.__BFCHAINV2Api;
        }
    }

    get BTGMChainApi() {
        if (this.__BTGMChainApi) {
            return this.__BTGMChainApi;
        } else {
            this.__BTGMChainApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["btgmeta"]);
            return this.__BTGMChainApi;
        }
    }
    get BTCMChainApi() {
        if (this.__BTCMChainApi) {
            return this.__BTCMChainApi;
        } else {
            this.__BTCMChainApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["btcmeta"]);
            return this.__BTCMChainApi;
        }
    }

    get BIWMChainApi() {
        if (this.__BIWMChainApi) {
            return this.__BIWMChainApi;
        } else {
            this.__BIWMChainApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["biwmeta"]);
            return this.__BIWMChainApi;
        }
    }

    get MalibuApi() {
        if (this.__MalibuApi) {
            return this.__MalibuApi;
        } else {
            this.__MalibuApi = this.walletFactory.generateBCFApi(this.__getConfigForce().bcf["malibu"]);
            return this.__MalibuApi;
        }
    }
    /**
     * 获取内链api
     * @param chainName
     */
    getInternalChainApi(chainName: InternalChainName) {
        switch (chainName) {
            case InternalChainName.BFMCHAIN:
                return this.BFMApi;
            case InternalChainName.CCCHAIN:
                return this.CCChainApi;
            case InternalChainName.PMCHAIN:
                return this.PMChainApi;
            case InternalChainName.ETHMETA:
                return this.ETHMChainApi;
            case InternalChainName.BFCHAINV2:
                return this.BFCHAINV2Api;
            case InternalChainName.BTGMETA:
                return this.BTGMChainApi;
            case InternalChainName.BTCMETA:
                return this.BTCMChainApi;
            case InternalChainName.BIWMETA:
                return this.BIWMChainApi;
            case InternalChainName.MALIBU:
                return this.MalibuApi;
            default:
                break;
        }
        throw Error(`chainApi:${chainName} is not exist`);
    }

    async stupidBlackAddressListCheck(publicKey: string) {
        const address = await this.bfmetaSignUtil.getAddressFromPublicKeyString(publicKey);
        return set.has(address.substring(1));
    }
}

export class MyBFMetaSignUtil extends BFMetaSignUtil {
    constructor(prefix: string, buffer: BFMetaSignUtil.Buffer.BufferConstructor, cryptoHelper: BFMetaSignUtil.CryptoHelperInterface) {
        super(prefix, buffer, cryptoHelper);
    }
    async getPublicKeyBySecret(secret: string) {
        const keypair = await this.createKeypair(secret);
        return keypair.publicKey.toString("hex");
    }

    async encryptData(data: any, secret: string, serverPublicKey: string) {
        const keypair = await this.createKeypair(secret);
        const result = this.asymmetricEncrypt(
            new Uint8Array(Buffer.from(JSON.stringify(data))),
            new Uint8Array(Buffer.from(serverPublicKey, "hex")),
            keypair.secretKey,
        );
        return Buffer.from(result.encryptedMessage).toString("base64");
    }
}
