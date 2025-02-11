import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GlobalApp } from "./global.app";
import { mysqlConfig } from "../../common/entity/mysql.config";
import { UpgradeModule } from "../../module/upgrade/upgrade.module";
import { WalletRequestMiddleware } from "../../common";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { ExternalChainTransModule } from "../../module/external-chain-trans/external-chain-trans.module";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module";

@Module({
    imports: [TypeOrmModule.forRootAsync(mysqlConfig), RedisBaseModule, UpgradeModule, InternalChainTransModule, ExternalChainTransModule],
    controllers: [],
    providers: [GlobalApp],
})
export class GlobalAppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(WalletRequestMiddleware).forRoutes("*");
    }
}
