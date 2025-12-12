import * as crypto from "node:crypto";
import * as childProcess from "node:child_process";
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
import { GetNotifyListDto, RestartAppDto, UpdateNotifyDto } from "./dto/notify.dto";
import { FindOptionsWhere } from "typeorm";
const { exec } = childProcess;

@Injectable()
export class NotifyService {
    @Inject(NotifyRepository)
    private __notifyRepository: NotifyRepository;
    private netWorkHelper = new NetWorkHelper(staticConfig.notify.url, staticConfig.notify.port);
    constructor() {}

    async listNotify(dto: GetNotifyListDto) {
        const opt: FindOptionsWhere<NotifyEntity> = {};
        if (dto.trSignature) {
            opt.trSignature = dto.trSignature;
        }
        if (dto.fromAddress) {
            opt.fromAddress = dto.fromAddress;
        }
        if (dto.tid) {
            opt.tid = dto.tid;
        }
        if (dto.notifyResult) {
            opt.notifyResult = Number(dto.notifyResult);
        }
        if (Object.keys(opt).length === 0) {
            throw Error("should fill param");
        }
        const arrs = await this.__notifyRepository.find({ where: opt });
        return arrs;
    }

    async updateNotify(dto: UpdateNotifyDto) {
        const { id, notifyResult } = dto;
        if (!id) {
            throw Error(`invaild id ${id}`);
        }
        if (!(notifyResult in NotifyResult)) {
            throw Error(`invaild notifyResult ${notifyResult}`);
        }
        const item = await this.__notifyRepository.findOne({ where: { id } });
        if (!item) {
            throw Error(`cat not find item ${id}`);
        }
        item.notifyResult = notifyResult;
        await this.__notifyRepository.save(item);
        return item;
    }

    async beginCheckOnChain() {
        do {
            try {
                const arrs = await this.__notifyRepository.find({ where: { notifyResult: NotifyResult.UNDO } });
                Logger.debug(`begin beginCheckOnChain ${arrs.length}`);
                for (const item of arrs) {
                    try {
                        const result = await this.checkTrSignture(item);
                        if (result) {
                            item.notifyResult = NotifyResult.ONCHAIN;
                            item.retryNum = 0;
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
                const arrs = await this.__notifyRepository.find({ where: { notifyResult: NotifyResult.ONCHAIN } });
                Logger.debug(`begin beginCheckNotify ${arrs.length}`);
                for (const item of arrs) {
                    try {
                        const signtime = Date.now();
                        const url = new URL(item.notifyUrl);
                        const pathParts = url.pathname.split("/");
                        const post = pathParts[1];
                        const notifyUrl = item.notifyUrl;
                        let data: {
                            tid: string;
                            trsId: string;
                            fromAddress: string;
                            toAddress: string;
                            amount: string;
                            signtime: number;
                            customParam?: any;
                            signature?: string;
                        } = {
                            tid: item.tid,
                            trsId: item.trSignature,
                            fromAddress: item.fromAddress,
                            toAddress: item.toAddress,
                            amount: item.amount,
                            // customParam: {},
                            signtime: signtime,
                        };
                        const customParamString = item.customParamString;
                        if (customParamString) {
                            try {
                                const customParam = JSON.parse(customParamString);
                                data.customParam = customParam;
                            } catch (err) {
                                console.log(err);
                            }
                        }
                        data.signature = this.doSignData(staticConfig.notify.key, this.getSignData(data));
                        Logger.debug(`post ${notifyUrl} ${JSON.stringify(data)}`);
                        try {
                            const result: { success: boolean } = await this.netWorkHelper.postUrl(notifyUrl, data);
                            if (result.success) {
                                item.notifyResult = NotifyResult.NOTIFY_SUCCESS;
                                item.signTime = signtime;
                                item.signature = data.signature;
                            } else {
                                item.retryNum++;
                            }
                            Logger.debug(`post ${notifyUrl} result ${JSON.stringify(result)}`);
                        } catch (error) {
                            item.retryNum++;
                            console.log(error);
                        }
                        if (item.retryNum > CHECK_RETRY_MAX_NUM) {
                            item.notifyResult = NotifyResult.FAIL;
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

    async checkTrSignture(item: NotifyEntity) {
        try {
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
        } catch (error) {
            return false;
        }
        return false;
    }
    async saveNotify(dto: WalletCore.Notify.SaveNotifyParam, customParamString?: string) {
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
            n.signTime = 0;
            n.signature = "";
            n.notifyResult = NotifyResult.UNDO;
            n.retryNum = 0;
            if (customParamString) {
                n.customParamString = customParamString;
            }
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

    checkNotifyParam(
        dto: BcfBroadcastTransactionNotifyReqDto | EthBrocastDirectNotifyReqDto | TRC20TransactionNotifyDto,
        chainName: ExternalChainName | InternalChainName,
    ) {
        if (!dto.trsInfo) {
            throw `trsInfo is not vaild`;
        }
        const chain = dto.trsInfo.chain;
        if (chain in ExternalChainName || chain in InternalChainName) {
        } else {
            throw `${chain} is not vaild`;
        }
        if (chainName) {
            if (chain !== chainName) {
                throw `${chain} is not vaild`;
            }
        }
    }

    async restartApp(dto: RestartAppDto) {
        const result = await this.runExec(`supervisorctl restart ${dto.app}`);
        return result;
    }
    runExec(cmd: string): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    return reject(err);
                }
                resolve(stdout);
            });
        });
    }
}
