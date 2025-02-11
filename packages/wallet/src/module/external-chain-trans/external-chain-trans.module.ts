import { forwardRef, Module } from "@nestjs/common";
import { ExternalChainTransMgr } from "./external-chain-trans-mgr";
import { BTCModule } from "../btc/btc.module";
import { EthModule } from "../eth/eth.module";
import { BscModule } from "../bsc/bsc.module";
import { TronModule } from "../tron/tron.module";
import { OnChainFail_ExternalTransState, Success_ExternalTransState, WaitOnChain_ExternalTransState } from "./state";
import { QueneEventEmitter } from "@bnqkl/util-node";
import { RedisModule } from "../redis/redis.module";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module";
import { ExternalChainTransController } from "./external-chain-trans.controller";

@Module({
    imports: [
        forwardRef(() => EthModule),
        forwardRef(() => BscModule),
        forwardRef(() => TronModule),
        forwardRef(() => RedisModule),
        forwardRef(() => ContracTokenInfoModule),
        forwardRef(() => BTCModule),
    ],
    controllers: [ExternalChainTransController],
    providers: [ExternalChainTransMgr, WaitOnChain_ExternalTransState, OnChainFail_ExternalTransState, Success_ExternalTransState, QueneEventEmitter],
    exports: [ExternalChainTransMgr],
})
export class ExternalChainTransModule {}
