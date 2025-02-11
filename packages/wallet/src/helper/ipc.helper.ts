import { baseIpcHelpers, IPCHelpers } from "@bnqkl/wallet-sdk";
import { WORKER } from "../common/constants";

export const ipcHelpers: IPCHelpers<Wallet.Cluster.IPC_Request_Function> = baseIpcHelpers;

export class ProcessCheck {
    /**
     * 检测是否运行在global进程，不是的话报错
     *
     * @returns
     */
    static checkInGlobalWorker() {
        if (process.env["workerName"] !== WORKER.GLOBAL) {
            throw Error("checkInGlobalWorker fail");
        }
    }

    /**
     * 检测是否运行在business进程，不是的话报错
     *
     * @returns
     */
    static checkInBusinessWorker() {
        if (process.env["workerName"] !== WORKER.TRANS) {
            throw Error("checkInBusinessWorker fail");
        }
    }
}
