import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { WebApp } from "./web.app.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { mysqlConfig } from "../../common/entity/mysql.config.js";
import { ChainDataModule } from "../../module/chain-data/chain-data.module.js";
import { WalletRequestMiddleware } from "../../common/index.js";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { ExternalChainTransModule } from "../../module/external-chain-trans/external-chain-trans.module.js";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module.js";
import { RmbTransModule } from "../../module/rmb-trans/rmb-trans.module.js";
import { AirdropModule } from "../../module/airdrop/airdrop.module.js";
import { BCFModule } from "../../module/bcf/bcf.module.js";

@Module({
    imports: [
        TypeOrmModule.forRootAsync(mysqlConfig),
        RedisBaseModule,
        InternalChainTransModule,
        ExternalChainTransModule,
        BCFModule,
        ChainDataModule,
        RmbTransModule,
        AirdropModule,
    ],
    providers: [WebApp],
})
export class WebAppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(WalletRequestMiddleware).forRoutes("*");
    }
}
