import { forwardRef, Module } from "@nestjs/common";
import { PayFail_RmbTransState, Success_RmbTransState, WaitPay_RmbTransState } from "./state/index.js";
import { QueneEventEmitter } from "@bnqkl/util-node";
import { RedisModule } from "../redis/redis.module.js";
import { RmbTransController } from "./rmb-trans.controller.js";
import { RmbTransMgr } from "./rmb-trans-mgr.js";
import { RmbTransactionRepository, RmbTransService } from "./rmb-trans.service.js";

@Module({
    imports: [forwardRef(() => RedisModule)],
    controllers: [RmbTransController],
    providers: [RmbTransService, RmbTransMgr, RmbTransactionRepository, WaitPay_RmbTransState, PayFail_RmbTransState, Success_RmbTransState, QueneEventEmitter],
    exports: [RmbTransService, RmbTransMgr],
})
export class RmbTransModule {}
