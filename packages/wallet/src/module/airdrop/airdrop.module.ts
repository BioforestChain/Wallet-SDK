import { forwardRef, Module } from "@nestjs/common";
import { AirdropController } from "./airdrop.controller";
import { AirdropOrderRepository, AirdropTransferTxRepository } from "./airdrop.repository";
import { AirdropService } from "./airdrop.service";
import { RedisModule } from "../redis/redis.module";
import { AirdropOrderMgr } from "./order/airdrop-order-mgr";
import {
    IssueTxOnChainFail_AirdropOrderState,
    IssueTxWaitOnChain_AirdropOrderState,
    TransferTxOnChainFail_AirdropOrderState,
    TransferTxWaitOnChain_AirdropOrderState,
    Success_AirdropOrderState,
} from "./order/state";
import { InternalChainTransModule } from "../internal-chain-trans/internal-chain-trans.module";
import { MemoryModule } from "../memory/memory.module";

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
