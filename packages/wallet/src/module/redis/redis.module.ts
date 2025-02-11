import { Module, forwardRef } from "@nestjs/common";
import { ChainInfoRedisRepository } from "./chain-info.redis-repository";
import { GlobalValueRedisRepository } from "./global-value.redis-repository";

@Module({
    imports: [],
    providers: [GlobalValueRedisRepository, ChainInfoRedisRepository],
    exports: [GlobalValueRedisRepository, ChainInfoRedisRepository],
})
export class RedisModule {}
