import { ExternalTransStateID } from "@bnqkl/wallet-sdk";
import { forwardRef, Inject } from "@nestjs/common";
import { ChainInfoRedisRepository } from "../../redis/chain-info.redis-repository.js";
import { ExternalChainTransObj } from "../external-chain-trans-obj.js";
import { ExternalTransState } from "./external-trans.state.js";

/**外链交易最终状态 */
export abstract class ExternalTransFinallyState extends ExternalTransState {
    @Inject(forwardRef(() => ChainInfoRedisRepository))
    protected __chainInfoRedisRepository!: ChainInfoRedisRepository;

    constructor(stateId: ExternalTransStateID) {
        super(stateId);
    }

    /**
     * 进入状态后置逻辑
     * @param transObj
     */
    async afterEnterState(transObj: ExternalChainTransObj): Promise<void> {
        // 关闭交易
        await transObj.close();
    }
}
