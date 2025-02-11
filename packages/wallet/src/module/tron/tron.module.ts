import { forwardRef, Module } from "@nestjs/common";
import { TronService, TronTransactionRepository } from "./tron.service";
import { TronController } from "./tron.controller";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [forwardRef(() => ContracTokenInfoModule), forwardRef(() => RedisModule)],
    controllers: [TronController],
    providers: [TronService, TronTransactionRepository],
    exports: [TronService],
})
export class TronModule {}
export * from "./tron.service";
