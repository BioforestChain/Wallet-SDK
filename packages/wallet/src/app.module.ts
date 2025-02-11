import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Master } from "./cluster/master";
import { UpgradeModule } from "./module/upgrade/upgrade.module";
import { mysqlConfig } from "./common";

@Module({
    imports: [TypeOrmModule.forRootAsync(mysqlConfig), UpgradeModule],
    providers: [Master],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {}
}
