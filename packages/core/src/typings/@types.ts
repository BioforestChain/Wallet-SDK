import type { ExternalChainName, InternalChainName } from "@bnqkl/wallet-typings";

export {};
declare global {
    export namespace WalletCore {
        export namespace Notify {
            export interface SaveNotifyParam {
                chainName: ExternalChainName | InternalChainName;
                trSignature: string;
                notifyUrl: string;
                fromAddress: string;
                toAddress: string;
                amount: string;
            }
        }
    }
}
