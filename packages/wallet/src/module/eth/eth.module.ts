import { forwardRef, Module } from "@nestjs/common";
import { EthService, EthTransactionRepository } from "./eth.service";
import { EthController } from "./eth.controller";
import { ContracTokenInfoModule } from "../contract-token-info/contract-token-info.module";
import { RedisModule } from "../redis/redis.module";
import { NotifyModule } from "../notify/notify.module";

@Module({
    imports: [forwardRef(() => ContracTokenInfoModule), forwardRef(() => RedisModule), forwardRef(() => NotifyModule)],
    controllers: [EthController],
    providers: [EthService, EthTransactionRepository],
    exports: [EthService],
})
export class EthModule {}
