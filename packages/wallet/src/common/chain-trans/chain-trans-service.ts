import { BaseRepository, ExternalChainName, InternalChainName, Logger, sleep } from "@bnqkl/wallet-sdk";
import { QueneEventEmitter } from "@bnqkl/util-node";
import { $EventInOutMap } from "@bnqkl/util-node/event-quene_emitter";
import { ChainTransEntity } from "../entity/chain-trans.entity.js";
import { forwardRef, Inject } from "@nestjs/common";
import { ChainInfoRedisRepository } from "../../module/redis.js";
import { CHAIN_INFO_HKEY } from "../constants.js";

/**链上交易Service */
export abstract class ChainTransServiceBase<
    StateID extends number,
    ChainName extends string,
    Entity extends ChainTransEntity<StateID, ChainName>,
    EM extends $EventInOutMap = any,
> extends QueneEventEmitter<EM> {
    @Inject(forwardRef(() => ChainInfoRedisRepository))
    protected __chainInfoRedisRepository!: ChainInfoRedisRepository;

    abstract repository: BaseRepository<Entity>;

    constructor(public chainName: ChainName) {
        super();
    }

    /**
     * 获取下一个出块间隔
     */
    abstract getNextBlockInterval(): Promise<number>;

    /**
     * 获取最新区块高度
     */
    protected abstract __heightGetter(): Promise<number>;

    /**
     * 获取同步延迟高度
     */
    protected __getSyncDelayHeight(): number {
        return 0;
    }

    /**
     * 获取链的最新高度
     */
    async heightGetter() {
        do {
            let interval = await this.getNextBlockInterval();
            let sleepTime = 10000;
            try {
                const height = await this.__heightGetter();
                if (height) {
                    sleepTime = interval * 1000;
                    await this.setRemoteLastBlockHeight(height);
                    const emitHeight = height - this.__getSyncDelayHeight();
                    const localHeight = await this.getLocalLastBlockHeight();
                    if (localHeight < emitHeight) {
                        if (this.chainName in ExternalChainName) {
                            // 外链没有同步过程，直接设置本地高度
                            await this.setLocalLastBlockHeight(emitHeight);
                        }
                        // Logger.debug(`[${this.chainName}] update height ${emitHeight}`);
                        this.emit("onNewBlock", emitHeight);
                    } else {
                        if (this.chainName in ExternalChainName) {
                            // 外链不知道还差几秒是下一个块，只能一秒一秒逼近
                            sleepTime = 1000;
                        }
                    }
                }
            } catch (err) {
                Logger.error(err);
            } finally {
                await sleep(sleepTime);
            }
        } while (true);
    }

    /**
     * 设置远端最新区块高度
     * @param lastBlockHeight
     */
    async setRemoteLastBlockHeight(lastBlockHeight: number) {
        await this.__chainInfoRedisRepository.setCounterNum(this.chainName, CHAIN_INFO_HKEY.REMOTE_HEIGHT, lastBlockHeight);
    }

    /**
     * 获取远端最新区块高度
     */
    async getRemoteLastBlockHeight(): Promise<number> {
        return await this.__chainInfoRedisRepository.getCounterNum(this.chainName, CHAIN_INFO_HKEY.REMOTE_HEIGHT);
    }

    /**
     * 设置本地已同步的区块高度
     * @param lastBlockHeight
     */
    async setLocalLastBlockHeight(lastBlockHeight: number) {
        await this.__chainInfoRedisRepository.setCounterNum(this.chainName, CHAIN_INFO_HKEY.LOCAL_HEIGHT, lastBlockHeight);
    }

    /**
     * 获取本地已同步的区块高度
     */
    async getLocalLastBlockHeight() {
        let localHeight = await this.__chainInfoRedisRepository.getCounterNum(this.chainName, CHAIN_INFO_HKEY.LOCAL_HEIGHT);
        if (localHeight === 0) {
            localHeight = await this.getRemoteLastBlockHeight();
            await this.setLocalLastBlockHeight(localHeight);
        }
        return localHeight;
    }
}
