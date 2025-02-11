import { AIRDROP_ORDER_STATE_ID } from "@bnqkl/wallet-sdk";
import { AirdropOrderObj } from "../airdrop-order-obj";
import { AirdropOrderState } from "./airdrop-order.state";
import { Inject, forwardRef } from "@nestjs/common";
import { InternalChainTransMgr } from "../../../internal-chain-trans/internal-chain-trans-mgr";
import { MemoryService } from "../../../memory/memory.service";
import { GlobalValueRedisRepository } from "../../../redis";

/**空投订单待处理状态 */
export abstract class AirdropOrderPendingState extends AirdropOrderState {
    @Inject(forwardRef(() => InternalChainTransMgr))
    protected __internalChainTransMgr!: InternalChainTransMgr;
    @Inject(forwardRef(() => MemoryService))
    protected __memoryService!: MemoryService;
    @Inject(forwardRef(() => GlobalValueRedisRepository))
    protected __globalValueRedisRepository!: GlobalValueRedisRepository;

    constructor(stateId: AIRDROP_ORDER_STATE_ID) {
        super(stateId);
    }

    /**
     * 进入状态前置逻辑
     * @param orderObj
     */
    async beforeEnterState(orderObj: AirdropOrderObj): Promise<void> {
        // 保存state
        await orderObj.saveState();
    }
}
