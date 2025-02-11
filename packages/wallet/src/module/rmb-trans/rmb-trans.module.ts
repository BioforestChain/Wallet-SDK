import { forwardRef, Module } from "@nestjs/common";
import { PayFail_RmbTransState, Success_RmbTransState, WaitPay_RmbTransState } from "./state";
import { QueneEventEmitter } from "@bnqkl/util-node";
import { RedisModule } from "../redis/redis.module";
import { RmbTransController } from "./rmb-trans.controller";
import { RmbTransMgr } from "./rmb-trans-mgr";
import { RmbTransactionRepository, RmbTransService } from "./rmb-trans.service";

@Module({
    imports: [forwardRef(() => RedisModule)],
    controllers: [RmbTransController],
    providers: [RmbTransService, RmbTransMgr, RmbTransactionRepository, WaitPay_RmbTransState, PayFail_RmbTransState, Success_RmbTransState, QueneEventEmitter],
    exports: [RmbTransService, RmbTransMgr],
})
export class RmbTransModule {}
