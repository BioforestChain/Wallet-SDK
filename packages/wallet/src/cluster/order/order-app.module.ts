import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { WalletRequestMiddleware, mysqlConfig } from "../../common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemoryModule } from "../../module/memory/memory.module";
import { RedisModule } from "../../module/redis/redis.module";
import { OrderApp } from "./order.app";
import { AirdropModule } from "../../module/airdrop/airdrop.module";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module";
import { NotifyModule } from "../../module/notify/notify.module";

@Module({
    imports: [TypeOrmModule.forRootAsync(mysqlConfig), RedisBaseModule, RedisModule, InternalChainTransModule, MemoryModule, AirdropModule, NotifyModule],
    controllers: [],
    providers: [OrderApp],
})
export class OrderAppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(WalletRequestMiddleware).forRoutes("*");
    }
}
