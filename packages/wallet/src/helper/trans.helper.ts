import { $noNullMap, ExternalChainName, InternalChainName, Logger } from "@bnqkl/wallet-sdk";
import { BLOB_IN_TRS_REMARK_PREFIX, CMD, WORKER } from "../common";
import { ipcHelpers } from "./ipc.helper";
import { decodeHex } from "@bnqkl/util-node";

export class TransHelper {
    /**
     * 获取交易体里的二进制文件hash数组
     * @param tr
     * @returns
     */
    static getTransBlobHashArray(tr: BFMetaNodeSDK.Basic.TransactionJSON): string[] {
        const blobHashArray: string[] = [];
        const blob_sha256_prefix = BLOB_IN_TRS_REMARK_PREFIX.SHA256;
        for (const key in tr.remark) {
            const value = tr.remark[key];
            if (value.startsWith(blob_sha256_prefix)) {
                const items = value.slice(blob_sha256_prefix.length).split("?");
                if (items.length !== 2) {
                    continue;
                }
                try {
                    const sha256 = decodeHex(items[0]);
                    if (sha256.length === 32) {
                        const subItems = items[1].split("=");
                        if (subItems.length !== 2) {
                            continue;
                        }
                        if (subItems[0] !== "size") {
                            continue;
                        }
                        const value = Number(subItems[1]);
                        if (Number.isNaN(value)) {
                            continue;
                        }
                        blobHashArray.push(items[0]);
                    }
                } catch {}
            }
        }
        return blobHashArray;
    }

    /**
     * 生成外链交易逻辑对象
     * @param chainName
     * @param txId
     */
    static async createExternalTransObj(chainName: ExternalChainName, txId: string): Promise<void> {
        if (!(await ipcHelpers.request(`${WORKER.TRANS}`, CMD.CREATE_EXTERNAL_TRANS_OBJ, { chainName, txId }))) {
            Logger.warn(`${CMD.CREATE_EXTERNAL_TRANS_OBJ} chainName:${chainName} txId：${txId} fail`);
        }
    }

    /**
     * 生成内链交易逻辑对象
     * @param chainName
     * @param txId
     */
    static async createInternalTransObj(chainName: InternalChainName, txId: string): Promise<void> {
        if (!(await ipcHelpers.request(`${WORKER.TRANS}`, CMD.CREATE_INTERNAL_TRANS_OBJ, { chainName, txId }))) {
            Logger.warn(`${CMD.CREATE_INTERNAL_TRANS_OBJ} chainName:${chainName} txId：${txId} fail`);
        }
    }

    /**
     * 生成人民币交易逻辑对象
     * @param txId
     */
    static async createRmbTransObj(txId: string): Promise<void> {
        if (!(await ipcHelpers.request(`${WORKER.TRANS}`, CMD.CREATE_RMB_TRANS_OBJ, { txId }))) {
            Logger.warn(`${CMD.CREATE_RMB_TRANS_OBJ}  txId：${txId} fail`);
        }
    }
}
