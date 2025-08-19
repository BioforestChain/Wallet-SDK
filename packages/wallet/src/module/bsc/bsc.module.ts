import { forwardRef, Module } from "@nestjs/common";
import { BscService, BscTransactionRepository } from "./bsc.service.js";
import { BscController } from "./bsc.controller.js";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module.js";
import { RedisModule } from "../redis/redis.module.js";
import { NotifyModule } from "../notify/notify.module.js";

@Module({
    imports: [forwardRef(() => ContracTokenInfoModule), forwardRef(() => RedisModule), forwardRef(() => NotifyModule)],
    controllers: [BscController],
    providers: [BscService, BscTransactionRepository],
    exports: [BscService],
})
export class BscModule {}
export * from "./bsc.service.js";
