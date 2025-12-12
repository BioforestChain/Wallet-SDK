import { ExternalChainName } from "@bnqkl/wallet-typings";
import { CHAIN_NETWORK_TYPE } from "./constants";

export {};
declare global {
    export namespace WalletServerSdk {
        export namespace Trans {
            export type Options = {
                address: string;
                publicKey?: string;
            };
        }

        export namespace Config {
            /** 所有配置信息 */
            export interface CustomerConfig extends ServerUtil.Config.CustomerConfig {
                chainConfig: {
                    chainNetworkType: CHAIN_NETWORK_TYPE;
                    chain: BFChainWallet.Config;
                    transactionMakerPort: {
                        ip: string;
                        pmchain: number;
                        ethmchain: number;
                        bfchainv2: number;
                        bfmchain: number;
                        ccchain: number;
                        btgmeta: number;
                        biwmeta: number;
                    };
                };
                docs: boolean;
            }
        }
    }
}
