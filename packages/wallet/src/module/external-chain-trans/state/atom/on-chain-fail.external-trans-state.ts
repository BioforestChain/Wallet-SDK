import { TRANS_QUEUE_ROUTING_KEY, ExternalTransStateID } from "@bnqkl/wallet-sdk";
import { Injectable } from "@nestjs/common";
import { CHAIN_INFO_KEY_TYPE } from "../../../../common/index.js";
import { walletPublisher } from "../../../mq/index.js";
import type { ExternalChainTransObj } from "../../external-chain-trans-obj.js";
import { ExternalTransFinallyState } from "../external-trans-finally.state.js";

/**上链失败状态 */
@Injectable()
export class OnChainFail_ExternalTransState extends ExternalTransFinallyState {
    constructor() {
        super(ExternalTransStateID.ON_CHAIN_FAIL);
    }

    /**
     * 进入状态
     * @param transObj
     */
    async onEnterState(transObj: ExternalChainTransObj): Promise<void> {
        const { chainName, txId, mqId, linkId } = transObj;
        if (linkId && mqId) {
            await walletPublisher.publishOnChainEvent(TRANS_QUEUE_ROUTING_KEY.EXTERNAL_FAIL, { chainName, entityId: txId }, mqId);
        }
        // 删除查询次数
        await this.__chainInfoRedisRepository.delFromHash(chainName, CHAIN_INFO_KEY_TYPE.EXTERNAL_TRANS_QUERY, [txId]);
    }
}
