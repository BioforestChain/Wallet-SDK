import { forwardRef, Module } from "@nestjs/common";
import { InternalChainTransMgr } from "./internal-chain-trans-mgr.js";
import { OnChainFail_InternalTransState, Success_InternalTransState, WaitOnChain_InternalTransState } from "./state/index.js";
import { QueneEventEmitter } from "@bnqkl/util-node";
import { InternalChainTransController } from "./internal-chain-trans.controller.js";
import { BCFModule } from "../bcf/bcf.module.js";
import { NotifyModule } from "../notify/notify.module.js";

@Module({
    imports: [forwardRef(() => BCFModule), forwardRef(() => NotifyModule)],
    controllers: [InternalChainTransController],
    providers: [InternalChainTransMgr, WaitOnChain_InternalTransState, OnChainFail_InternalTransState, Success_InternalTransState, QueneEventEmitter],
    exports: [InternalChainTransMgr],
})
export class InternalChainTransModule {}
