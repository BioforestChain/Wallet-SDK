import { forwardRef, Module } from "@nestjs/common";
import { InternalChainTransMgr } from "./internal-chain-trans-mgr";
import { OnChainFail_InternalTransState, Success_InternalTransState, WaitOnChain_InternalTransState } from "./state";
import { QueneEventEmitter } from "@bnqkl/util-node";
import { InternalChainTransController } from "./internal-chain-trans.controller";
import { BCFModule } from "../bcf/bcf.module";
import { NotifyModule } from "../notify/notify.module";

@Module({
    imports: [forwardRef(() => BCFModule), forwardRef(() => NotifyModule)],
    controllers: [InternalChainTransController],
    providers: [InternalChainTransMgr, WaitOnChain_InternalTransState, OnChainFail_InternalTransState, Success_InternalTransState, QueneEventEmitter],
    exports: [InternalChainTransMgr],
})
export class InternalChainTransModule {}
