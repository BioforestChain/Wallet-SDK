import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GlobalApp } from "./global.app.js";
import { mysqlConfig } from "../../common/entity/mysql.config.js";
import { UpgradeModule } from "../../module/upgrade/upgrade.module.js";
import { WalletRequestMiddleware } from "../../common.js";
import { RedisBaseModule } from "@bnqkl/wallet-sdk";
import { ExternalChainTransModule } from "../../module/external-chain-trans/external-chain-trans.module.js";
import { InternalChainTransModule } from "../../module/internal-chain-trans/internal-chain-trans.module.js";
import { NotifyModule } from "../../module/notify/notify.module.js";

@Module({
    imports: [TypeOrmModule.forRootAsync(mysqlConfig), RedisBaseModule, UpgradeModule, InternalChainTransModule, ExternalChainTransModule, NotifyModule],
    controllers: [],
    providers: [GlobalApp],
})
export class GlobalAppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(WalletRequestMiddleware).forRoutes("*");
    }
}
