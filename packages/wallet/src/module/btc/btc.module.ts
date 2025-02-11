import { forwardRef, Module } from "@nestjs/common";
import { BTCService } from "./btc.service";
import { BTCController } from "./btc.controller";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [forwardRef(() => RedisModule)],
    controllers: [BTCController],
    providers: [BTCService],
    exports: [BTCService],
})
export class BTCModule {}
