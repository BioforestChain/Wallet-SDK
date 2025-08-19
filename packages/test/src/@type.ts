import type {} from "@bfmeta/sign-util";
import type { NetWorkHelper } from "@bnqkl/wallet";

export {};
declare global {
    export namespace WalletTest {
        /**账号信息 */
        export interface Account {
            info: {
                deviceId: string;
                secret: string;
                secret2: string;
                address: string;
                keypair: {
                    secretKey: BFMetaSignUtil.Buffer.Buffer;
                    publicKey: BFMetaSignUtil.Buffer.Buffer;
                };
            };
            /**服务的连接 */
            network: NetWorkHelper;
        }

        /**外链转账参数 */
        export interface ExternalTransferArgs {
            /**外链账户 */
            account: {
                /**私钥 */
                privateKey?: string;
                /**助记词 */
                mnemonic?: string;
            };
            /**接收地址 */
            to: string;
            /**合约地址 */
            contractAddress?: string;
            /**转账数量 */
            amount: string;
        }
    }
}
