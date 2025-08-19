import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { WalletRequestMiddleware, mysqlConfig } from "../../common/index.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemoryModule } from "../../module/memory/memory.module.js";
import { RedisModule } from "../../module/redis/redis.module.js";
import { OrderApp } from "./order.app.js";
import { AirdropModule } from "../../module/airdrop/airdrop.module.js";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module.js";
import { NotifyModule } from "../../module/notify/notify.module.js";

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
