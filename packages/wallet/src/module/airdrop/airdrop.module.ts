import { forwardRef, Module } from "@nestjs/common";
import { AirdropController } from "./airdrop.controller.js";
import { AirdropOrderRepository, AirdropTransferTxRepository } from "./airdrop.repository.js";
import { AirdropService } from "./airdrop.service.js";
import { RedisModule } from "../redis/redis.module.js";
import { AirdropOrderMgr } from "./order/airdrop-order-mgr.js";
import {
    IssueTxOnChainFail_AirdropOrderState,
    IssueTxWaitOnChain_AirdropOrderState,
    TransferTxOnChainFail_AirdropOrderState,
    TransferTxWaitOnChain_AirdropOrderState,
    Success_AirdropOrderState,
} from "./order/state/index.js";
import { InternalChainTransModule } from "../internal-chain-trans/internal-chain-trans.module.js";
import { MemoryModule } from "../memory/memory.module.js";

@Module({
    imports: [forwardRef(() => RedisModule), forwardRef(() => InternalChainTransModule), forwardRef(() => MemoryModule)],
    controllers: [AirdropController],
    providers: [
        AirdropService,
        AirdropOrderRepository,
        AirdropTransferTxRepository,
        AirdropOrderMgr,
        IssueTxWaitOnChain_AirdropOrderState,
        IssueTxOnChainFail_AirdropOrderState,
        TransferTxWaitOnChain_AirdropOrderState,
        TransferTxOnChainFail_AirdropOrderState,
        Success_AirdropOrderState,
    ],
    exports: [AirdropService, AirdropOrderMgr],
})
export class AirdropModule {}
