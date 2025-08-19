import { Injectable } from "@nestjs/common";
import { AIRDROP_TYPE, GlobalValueRedisBaseRepository } from "@bnqkl/wallet-sdk";
import { GLOBAL_VALUE_ENTITY_ID } from "../../common/index.js";
import { bfmetaSignUtil } from "../../helper/index.js";
import * as bip39 from "bip39";

/**全局的Redis数据操作仓库 */
@Injectable()
export class GlobalValueRedisRepository extends GlobalValueRedisBaseRepository {
    getBfmetaSignUtil() {
        return bfmetaSignUtil;
    }

    /**空投账户map */
    private __airdropAccountMap = new Map<string, Wallet.Airdrop.AirdropAccount>();

    private __getAirdropAccountKey(airdropType: AIRDROP_TYPE) {
        return AIRDROP_TYPE[airdropType];
    }

    /**
     * 获取空投账户
     * @param airdropType
     * @param forceSecret
     * @returns
     */
    async getAirdropAccount(airdropType: AIRDROP_TYPE, forceSecret?: string) {
        const keyName = this.__getAirdropAccountKey(airdropType);
        let account = this.__airdropAccountMap.get(keyName);
        if (account) {
            return account;
        }
        /**redis里面取 */
        const serverKeypair = await this.getServerKeypair();
        const clientPublicKey = process.env["clientPublicKey"] as string;
        const redisValue = await this.getKeyValue(GLOBAL_VALUE_ENTITY_ID.ACCOUNT, keyName);
        if (redisValue) {
            // redis取出来以后再解密
            const bytes = bfmetaSignUtil.asymmetricDecrypt(
                Buffer.from(redisValue, "base64"),
                new Uint8Array(Buffer.from(clientPublicKey, "hex")),
                serverKeypair.secretKey,
            );
            if (!bytes) {
                throw Error(`decrypt fail`);
            }
            const secret = Buffer.from(bytes).toString();
            account = {
                secret,
                address: await bfmetaSignUtil.getAddressFromSecret(secret),
                type: keyName,
            };
            this.__airdropAccountMap.set(keyName, account);
        } else {
            // redis也没有就重新生成
            account = await this.__initAirdropAccount(airdropType, forceSecret);
        }
        return account;
    }

    /**
     * 初始化空投账户
     * @param airdropType
     * @param forceSecret
     * @returns
     */
    private async __initAirdropAccount(airdropType: AIRDROP_TYPE, forceSecret?: string) {
        const serverKeypair = await this.getServerKeypair();
        const clientPublicKey = process.env["clientPublicKey"] as string;
        const keyName = this.__getAirdropAccountKey(airdropType);
        // redis也没有就重新生成
        const secret = forceSecret || bip39.generateMnemonic();
        // 加密之后再存入redis中
        const result = bfmetaSignUtil.asymmetricEncrypt(
            new Uint8Array(Buffer.from(secret)),
            new Uint8Array(Buffer.from(clientPublicKey, "hex")),
            serverKeypair.secretKey,
        );
        // 这个值存到redis
        await this.setKeyValue(GLOBAL_VALUE_ENTITY_ID.ACCOUNT, keyName, Buffer.from(result.encryptedMessage).toString("base64"));
        const account: Wallet.Airdrop.AirdropAccount = {
            secret,
            address: await bfmetaSignUtil.getAddressFromSecret(secret),
            type: keyName,
        };
        this.__airdropAccountMap.set(keyName, account);
        return account;
    }
}
