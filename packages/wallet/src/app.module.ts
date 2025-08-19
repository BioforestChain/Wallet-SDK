import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Master } from "./cluster/master.js";
import { UpgradeModule } from "./module/upgrade/upgrade.module.js";
import { mysqlConfig } from "./common.js";

@Module({
    imports: [TypeOrmModule.forRootAsync(mysqlConfig), UpgradeModule],
    providers: [Master],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {}
}
