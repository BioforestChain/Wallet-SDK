import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { mysqlConfig } from "@bnqkl/wallet";
import { TestApp } from "./test.app.js";
import { TransTestModule } from "./trans/trans-test.module.js";
import { AirdropTestModule } from "./airdrop/airdrop-test.module.js";

@Module({
    imports: [TypeOrmModule.forRootAsync(mysqlConfig), TransTestModule, AirdropTestModule],
    controllers: [],
    providers: [TestApp],
})
export class TestModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {}
}
