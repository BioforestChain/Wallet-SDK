import { Module, forwardRef } from "@nestjs/common";
import { ChainInfoRedisRepository } from "./chain-info.redis-repository.js";
import { GlobalValueRedisRepository } from "./global-value.redis-repository.js";

@Module({
    imports: [],
    providers: [GlobalValueRedisRepository, ChainInfoRedisRepository],
    exports: [GlobalValueRedisRepository, ChainInfoRedisRepository],
})
export class RedisModule {}
