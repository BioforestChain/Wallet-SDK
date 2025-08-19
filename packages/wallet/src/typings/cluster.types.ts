import { ExternalChainName, InternalChainName } from "@bnqkl/wallet-typings";
import { CMD } from "../common.js";

export {};
declare global {
    export namespace Wallet {
        export namespace Cluster {
            export interface IPC_Request_Function {
                [CMD.CREATE_INTERNAL_TRANS_OBJ]: ServerUtil.Cluster.ReqResAsync<{ chainName: InternalChainName; txId: string }, boolean>;
                [CMD.CREATE_EXTERNAL_TRANS_OBJ]: ServerUtil.Cluster.ReqResAsync<{ chainName: ExternalChainName; txId: string }, boolean>;
                [CMD.CREATE_RMB_TRANS_OBJ]: ServerUtil.Cluster.ReqResAsync<{ txId: string }, boolean>;
                [CMD.CREATE_AIRDROP_ORDER_OBJ]: ServerUtil.Cluster.ReqResAsync<{ orderId: string }, boolean>;
            }
        }
    }
}
