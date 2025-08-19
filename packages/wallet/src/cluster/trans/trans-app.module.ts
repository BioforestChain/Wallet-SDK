import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TransApp } from "./trans.app.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "../../module/redis/redis.module.js";
import { WalletRequestMiddleware, mysqlConfig } from "../../common.js";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { ExternalChainTransModule } from "../../module/external-chain-trans/external-chain-trans.module.js";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module.js";
import { RmbTransModule } from "../../module/rmb-trans/rmb-trans.module.js";

@Module({
    imports: [TypeOrmModule.forRootAsync(mysqlConfig), RedisBaseModule, RedisModule, ExternalChainTransModule, InternalChainTransModule, RmbTransModule],
    controllers: [],
    providers: [TransApp],
})
export class TransAppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(WalletRequestMiddleware).forRoutes("*");
    }
}
