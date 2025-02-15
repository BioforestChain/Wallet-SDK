import * as crypto from "node:crypto";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { NotifyEntity } from "../../common/entity/notify.entity";
import { NotifyRepository } from "./notify.repository";
import { URL } from "url";
import { Logger, sleep } from "@bnqkl/server-util";
import { BcfBroadcastTransactionNotifyReqDto } from "../bcf/dto";
import { EthBrocastDirectNotifyReqDto } from "../eth/dto";
import { TRC20TransactionNotifyDto } from "../tron/dto";
import { CHECK_RETRY_MAX_NUM, ExternalChainName, InternalChainName, NotifyResult } from "@bnqkl/wallet-core";
import { NetWorkHelper } from "@bnqkl/server-util";
import { staticConfig } from "../../config";
import { walletSdk } from "../../helper";
import { BCFApi } from "@bfmeta/wallet-bcf";

@Injectable()
export class NotifyService {
    @Inject(NotifyRepository)
    private __notifyRepository: NotifyRepository;
    private netWorkHelper = new NetWorkHelper(staticConfig.notify.url, staticConfig.notify.port);
    constructor() {}

    async beginCheckOnChain() {
        do {
            try {
                Logger.debug(`begin beginCheckOnChain`);
                const arrs = await this.__notifyRepository.find({ where: { notifyResult: NotifyResult.UNDO } });
                for (const item of arrs) {
                    try {
                        const result = await this.checkTrSignture(item);
                        if (result) {
                            item.notifyResult = NotifyResult.ONCHAIN;
                        } else {
                            item.retryNum++;
                            if (item.retryNum > CHECK_RETRY_MAX_NUM) {
                                item.notifyResult = NotifyResult.FAIL;
                            }
                        }
                        await this.__notifyRepository.save(item);
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
            }
            await sleep(15000);
        } while (true);
    }

    async beginCheckNotify() {
        do {
            try {
                Logger.debug(`begin beginCheckNotify`);
                const arrs = await this.__notifyRepository.find({ where: { notifyResult: NotifyResult.ONCHAIN } });
                for (const item of arrs) {
                    try {
                        const result = await this.netWorkHelper.post("levelup", {
                            tid: item.tid,
                            fromAddress: item.fromAddress,
                            toAddress: item.toAddress,
                            amount: item.amount,
                            signTime: item.signTime,
                            signature: item.signature,
                        });

                        item.notifyResult = NotifyResult.NOTIFY_SUCCESS;
                        await this.__notifyRepository.save(item);
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
            }
            await sleep(15000);
        } while (true);
    }

    async checkTrSignture(item: NotifyEntity) {
        const hash = item.trSignature;
        let api!: BCFApi;
        switch (item.chainName) {
            case ExternalChainName.BSC:
                const resultBsc = await walletSdk.walletFactory.BscApi.getTransReceiptNative(hash);
                if (resultBsc?.status) {
                    return true;
                }
                break;
            case ExternalChainName.ETH:
                const resultEth = await walletSdk.walletFactory.EthApi.getTransReceiptNative(hash);
                if (resultEth?.status) {
                    return true;
                }
                break;
            case ExternalChainName.TRON:
                const resultTron = await walletSdk.walletFactory.TronApi.getTransReceipt(hash);
                if (resultTron?.status) {
                    return true;
                }
                break;
            case InternalChainName.BFCHAINV2:
                api = walletSdk.BFCHAINV2Api;
                break;
            case InternalChainName.BFMCHAIN:
                api = walletSdk.BFMApi;
                break;
            case InternalChainName.CCCHAIN:
                api = walletSdk.CCChainApi;
                break;
            case InternalChainName.PMCHAIN:
                api = walletSdk.PMChainApi;
                break;
            case InternalChainName.ETHMETA:
                api = walletSdk.ETHMChainApi;
                break;
            case InternalChainName.BTGMETA:
                api = walletSdk.BTGMChainApi;
                break;
            case InternalChainName.BTCMETA:
                api = walletSdk.BTCMChainApi;
                break;
            case InternalChainName.BIWMETA:
                api = walletSdk.BIWMChainApi;
                break;
            default:
                throw Error(`wrong chainname ${item.chainName}`);
        }
        if (api) {
            const r = await api.sdk.api.basic.getTransactions({
                signature: hash,
                minHeight: 1,
            });
            if (r.success && r.result.trs.length > 0) {
                return true;
            }
        }
        return false;
    }
    async saveNotify(dto: WalletCore.Notify.SaveNotifyParam) {
        try {
            const n = new NotifyEntity();
            n.chainName = dto.chainName;
            n.notifyUrl = dto.notifyUrl;
            const myUrl = new URL(dto.notifyUrl);
            const tid = myUrl.searchParams.get("tid");
            if (!tid) {
                throw `tid null ${dto.notifyUrl}`;
            }
            n.tid = tid;
            n.fromAddress = dto.fromAddress;
            n.toAddress = dto.toAddress;
            n.amount = dto.amount;
            n.trSignature = dto.trSignature;
            n.signTime = Date.now();
            n.signature = this.doSignData(
                "key",
                this.getSignData({
                    tid: n.tid,
                    fromAddress: n.fromAddress,
                    toAddress: n.toAddress,
                    amount: n.amount,
                    trSignature: n.trSignature,
                    signTime: n.signTime,
                }),
            );
            n.notifyResult = NotifyResult.UNDO;
            n.retryNum = 0;
            await this.__notifyRepository.save(n);
        } catch (error) {
            console.log(error);
            Logger.debug(`saveNotify error `);
        }
    }

    getSignData = (data: Record<string, any>) => {
        return JSON.stringify(
            [...Object.entries(data)].sort((fielda, fieldb) => {
                return fielda[0].localeCompare(fieldb[0]);
            }),
        );
    };
    doSignData = (key: string, signData: string) => {
        return crypto.createHash("sha256").update(signData).update(key).digest("hex");
    };

    checkNotifyParam(dto: BcfBroadcastTransactionNotifyReqDto | EthBrocastDirectNotifyReqDto | TRC20TransactionNotifyDto) {
        const chain = dto.trsInfo.chain;
        if (chain in ExternalChainName || chain in InternalChainName) {
        } else {
            throw `${chain} is not vaild`;
        }
    }
}
