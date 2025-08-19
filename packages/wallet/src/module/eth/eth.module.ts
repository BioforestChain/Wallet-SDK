import { forwardRef, Module } from "@nestjs/common";
import { EthService, EthTransactionRepository } from "./eth.service.js";
import { EthController } from "./eth.controller.js";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module.js";
import { RedisModule } from "../redis/redis.module.js";
import { NotifyModule } from "../notify/notify.module.js";

@Module({
    imports: [forwardRef(() => ContracTokenInfoModule), forwardRef(() => RedisModule), forwardRef(() => NotifyModule)],
    controllers: [EthController],
    providers: [EthService, EthTransactionRepository],
    exports: [EthService],
})
export class EthModule {}
