import { forwardRef, Module } from "@nestjs/common";
import { BTCService } from "./btc.service.js";
import { BTCController } from "./btc.controller.js";
import { RedisModule } from "../redis/redis.module.js";

@Module({
    imports: [forwardRef(() => RedisModule)],
    controllers: [BTCController],
    providers: [BTCService],
    exports: [BTCService],
})
export class BTCModule {}
