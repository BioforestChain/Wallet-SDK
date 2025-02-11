import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TransApp } from "./trans.app";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "../../module/redis/redis.module";
import { WalletRequestMiddleware, mysqlConfig } from "../../common";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { ExternalChainTransModule } from "../../module/external-chain-trans/external-chain-trans.module";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module";
import { RmbTransModule } from "../../module/rmb-trans/rmb-trans.module";

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
