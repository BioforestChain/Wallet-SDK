import { AlipaySdkConfig } from "alipay-sdk";

export {};
declare global {
    export namespace Wallet {
        export namespace Config {
            /** 所有配置信息 */
            export interface CustomerConfig extends WalletServerSdk.Config.CustomerConfig {
                coreForProcess: {
                    /**WebServer的数量 */
                    coreNumForWebServer: number;
                };
                ports: {
                    web: number;
                    trans: number;
                    global: number;
                    order: number;
                };
                chainConfig: {
                    /**内链同步延迟高度 */
                    syncInternalDelayHeight: number;
                } & WalletServerSdk.Config.CustomerConfig["chainConfig"] & {
                        chain: {
                            btc: {
                                rpcPath: string;
                                blockbookPath: string;
                            };
                        };
                    };
                blob: {
                    /**限制上传的文件类型 */
                    types: string[];
                    /**上传文件最大限制 */
                    maxSize: number;
                    /**上传文件根目录 */
                    uploadRootPath: string;
                };
                test: {
                    serverIp?: string;
                    port?: number;
                };
                alipay: WalletAlipaySdkConfig;
            }

            export interface WalletAlipaySdkConfig extends AlipaySdkConfig {
                /**异步通知地址 */
                notifyUrl: string;
            }
        }

        export namespace MysqlUpgrade {
            export type UpdateList = {
                /**版本号 */
                version: string;
                /**更新描述 */
                describe: string;
                /**执行的sql文件名 */
                fileName: string;
            }[];
        }
    }
}
