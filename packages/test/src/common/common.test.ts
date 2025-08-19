import {
    $asyncAllNoNullMap,
    bfmetaSignUtil,
    CHAIN_NETWORK_TYPE,
    ChainHelper,
    InternalChainName,
    Logger,
    NetWorkHelper,
    staticConfig,
    transactionMaker,
    WALLET_GLOBAL_PREFIX,
    WalletServerSDK,
} from "@bnqkl/wallet";
import { CommonApi } from "../api/common.api.js";
import { SECRETS } from "../constant.js";
import { BaseHelper } from "../helper/index.js";
import { TransApi } from "../api/trans.api.js";

export abstract class CommonTest {
    /**已登录用户集合 */
    private __loginAccountArray: WalletTest.Account[] = [];
    defaultNetwork = new NetWorkHelper(staticConfig.test.serverIp ?? "localhost", staticConfig.test.port ?? staticConfig.ports.web, WALLET_GLOBAL_PREFIX);
    walletServerSdk = new WalletServerSDK(staticConfig.test.serverIp ?? "localhost", staticConfig.test.port ?? staticConfig.ports.web);

    /**
     * 获取已登录的账号，每次调用返回的账号不重复
     * @param num
     * @param offset
     * @returns
     */
    async getLoginAccounts(num = 1, offset = 0) {
        const loginSecrets = SECRETS.slice(this.__loginAccountArray.length + offset, this.__loginAccountArray.length + offset + num);
        return await $asyncAllNoNullMap(loginSecrets, async ({ secret }) => {
            const info = await this.createAccountBySecret(secret);
            const network = new NetWorkHelper(
                staticConfig.test.serverIp ?? "localhost",
                staticConfig.test.port ?? staticConfig.ports.web,
                WALLET_GLOBAL_PREFIX,
            );
            await CommonApi.login(info, network);
            console.info(`login :${info.address}`);
            const account: WalletTest.Account = { info, network };
            this.__loginAccountArray.push(account);
            return account;
        });
    }

    async createAccountBySecret(secret: string): Promise<WalletTest.Account["info"]> {
        const keypair = await bfmetaSignUtil.createKeypair(secret);
        const address = await bfmetaSignUtil.getAddressFromPublicKey(keypair.publicKey);
        return {
            deviceId: secret,
            secret,
            secret2: BaseHelper.stringTOMnemonic(secret),
            address,
            keypair,
        };
    }

    /**
     * 转账交易带图片
     */
    async transferWithPicture() {
        const num = 2;
        const accounts = await this.getLoginAccounts(num);
        await $asyncAllNoNullMap([accounts[1]], async (account) => {
            const { info, network } = account;
            const chainName = InternalChainName.ETHMETA;
            const maker = await transactionMaker.getTrMaker(chainName);
            const param: TransactionMaker.Transaction.TransferAssetTransactionParams = {
                secret: info.secret,
                fee: "100",
                recipientId: "cDMenVpHefpDwActPsYpFzgnhLtbXtfNCz",
                applyBlockHeight: await TransApi.getLastblockHeight(chainName, network),
                assetInfo: {
                    amount: "200000000",
                    assetType: ChainHelper.getInternalMainAssetType(chainName, staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET),
                },
                remark: {
                    image1: "blob+sha256+hex://a8681c8943926801387ffad40bd7c028477ba704fa679c3104a32946b350a1bd?size=62182",
                    image2: "blob+sha256+hex://a376793ac6d0d37a5a7829595c1363de64f295cad402f1829079508fec94a571?size=94442",
                    image3: "blob+sha256+hex://6d68b13bef8e80f92f1b46fb1ee439c1d722ff7a32529a5ed3c963815bf32cdd?size=12719",
                },
            };
            const tempRet = await maker.transaction.generateTransferAsset(param);
            if (!tempRet.success) {
                throw tempRet;
            }
            const minFeeRet = await maker.common.calcTransactionMinFee({ transaction: tempRet.result });
            if (!minFeeRet.success) {
                throw minFeeRet;
            }
            param.fee = minFeeRet.result.minFee;
            const realRet = await maker.transaction.generateTransferAsset(param);
            if (!realRet.success) {
                throw realRet;
            }
            const trJson = realRet.result as WalletTypings.InternalChain.TransferAssetTransaction;
            Logger.debug(`transactionJSON = `, JSON.stringify(trJson, null, 2));
            const res = await TransApi.broadcastTransaction(chainName, trJson, network);
            Logger.debug(`broadcastTransaction done.`);
        });
    }
}
