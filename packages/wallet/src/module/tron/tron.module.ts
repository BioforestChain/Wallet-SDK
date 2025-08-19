import { forwardRef, Module } from "@nestjs/common";
import { TronService, TronTransactionRepository } from "./tron.service.js";
import { TronController } from "./tron.controller.js";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module.js";
import { RedisModule } from "../redis/redis.module.js";
import { NotifyModule } from "../notify/notify.module.js";

@Module({
    imports: [forwardRef(() => ContracTokenInfoModule), forwardRef(() => RedisModule), forwardRef(() => NotifyModule)],
    controllers: [TronController],
    providers: [TronService, TronTransactionRepository],
    exports: [TronService],
})
export class TronModule {}
export * from "./tron.service.js";
