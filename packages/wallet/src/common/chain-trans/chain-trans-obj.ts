import { FSMObj } from "@bnqkl/wallet-sdk";
import { FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { ChainTransEntity } from "../entity/chain-trans.entity.js";
import { ChainTransMgr } from "./chain-trans-mgr.js";
import { ChainTransState } from "./chain-trans-state.js";

/**链上交易的逻辑对象 */
export abstract class ChainTransObj<
        StateID extends number,
        ChainName extends string,
        State extends ChainTransState<StateID, ChainName> = ChainTransState<StateID, ChainName>,
        Entity extends ChainTransEntity<StateID, ChainName> = ChainTransEntity<StateID, ChainName>,
    >
    extends FSMObj<StateID, State, Entity>
    implements Wallet.ChainTrans.TransObj<StateID>
{
    constructor(entity: Entity, private __transMgr: ChainTransMgr<StateID, ChainName, State, Entity>) {
        super(entity, __transMgr);
    }

    get transType() {
        return this.__transMgr.transType;
    }

    /**交易id */
    get txId() {
        return this.entity.entityId;
    }

    /**链名 */
    get chainName() {
        return this.entity.chainName;
    }

    /**消息队列id */
    get mqId() {
        return this.entity.mqId;
    }

    /**关联业务表编号 */
    get linkId() {
        return this.entity.linkId;
    }

    /**内存缓存的key */
    get processingKey() {
        return this.txId;
    }

    /** 失败原因 */
    get failReason() {
        return this.entity.failReason;
    }
    set failReason(failReason: string | undefined) {
        this.entity.failReason = failReason;
    }

    /**
     * 保存
     */
    async save() {
        const transService = this.__transMgr.getTransactionService(this.chainName);
        await transService.repository.update({ entityId: this.txId } as FindOptionsWhere<Entity>, {
            ...(this.entity as QueryDeepPartialEntity<Entity>),
            updatedTime: new Date(),
        });
    }

    /**
     * 保存state
     */
    async saveState() {
        const transService = this.__transMgr.getTransactionService(this.chainName);
        await transService.repository.update(
            { entityId: this.txId } as FindOptionsWhere<Entity>,
            { state: this.curStateId, updatedTime: new Date() } as Partial<Entity> as QueryDeepPartialEntity<Entity>,
        );
    }

    /**
     * 关闭交易
     */
    async close() {
        // 保存
        await this.save();
        // 从处理map中删除
        this.__transMgr.deleteProcessingTrans(this.chainName, this.txId);
    }

    /**
     * 开始上链回调
     */
    async onChainStartCallback(): Promise<void> {
        await this.curState?.onChainStartCallback(this as ChainTransObj<StateID, ChainName>);
    }

    /**
     * 广播成功回调
     * @param txHash
     */
    async onBroadcastSuccessCallback(txHash: string): Promise<void> {
        await this.curState?.onBroadcastSuccessCallback(this as ChainTransObj<StateID, ChainName>, txHash);
    }

    /**
     * 上链成功回调
     * @param height
     * @param txHash
     */
    async onChainSuccessCallback(height: number, txHash: string) {
        await this.curState?.onChainSuccessCallback(this as ChainTransObj<StateID, ChainName>, height, txHash);
    }
}
