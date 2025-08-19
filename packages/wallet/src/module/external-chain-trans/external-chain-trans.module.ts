import { forwardRef, Module } from "@nestjs/common";
import { ExternalChainTransMgr } from "./external-chain-trans-mgr.js";
import { BTCModule } from "../btc/btc.module.js";
import { EthModule } from "../eth/eth.module.js";
import { BscModule } from "../bsc/bsc.module.js";
import { TronModule } from "../tron/tron.module.js";
import { OnChainFail_ExternalTransState, Success_ExternalTransState, WaitOnChain_ExternalTransState } from "./state/index.js";
import { QueneEventEmitter } from "@bnqkl/util-node";
import { RedisModule } from "../redis/redis.module.js";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module.js";
import { ExternalChainTransController } from "./external-chain-trans.controller.js";
import { NotifyModule } from "../notify/notify.module.js";

@Module({
    imports: [
        forwardRef(() => EthModule),
        forwardRef(() => BscModule),
        forwardRef(() => TronModule),
        forwardRef(() => RedisModule),
        forwardRef(() => ContracTokenInfoModule),
        forwardRef(() => BTCModule),
        forwardRef(() => NotifyModule),
    ],
    controllers: [ExternalChainTransController],
    providers: [ExternalChainTransMgr, WaitOnChain_ExternalTransState, OnChainFail_ExternalTransState, Success_ExternalTransState, QueneEventEmitter],
    exports: [ExternalChainTransMgr],
})
export class ExternalChainTransModule {}
