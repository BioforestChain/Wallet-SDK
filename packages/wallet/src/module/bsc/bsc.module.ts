import { forwardRef, Module } from "@nestjs/common";
import { BscService, BscTransactionRepository } from "./bsc.service";
import { BscController } from "./bsc.controller";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module";
import { RedisModule } from "../redis/redis.module";
import { NotifyModule } from "../notify/notify.module";

@Module({
    imports: [forwardRef(() => ContracTokenInfoModule), forwardRef(() => RedisModule), forwardRef(() => NotifyModule)],
    controllers: [BscController],
    providers: [BscService, BscTransactionRepository],
    exports: [BscService],
})
export class BscModule {}
export * from "./bsc.service";
