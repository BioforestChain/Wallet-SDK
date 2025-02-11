import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { WebApp } from "./web.app";
import { TypeOrmModule } from "@nestjs/typeorm";
import { mysqlConfig } from "../../common/entity/mysql.config";
import { ChainDataModule } from "../../module/chain-data/chain-data.module";
import { WalletRequestMiddleware } from "../../common";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { ExternalChainTransModule } from "../../module/external-chain-trans/external-chain-trans.module";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module";
import { RmbTransModule } from "../../module/rmb-trans/rmb-trans.module";
import { AirdropModule } from "../../module/airdrop/airdrop.module";
import { BCFModule } from "../../module/bcf/bcf.module";

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
