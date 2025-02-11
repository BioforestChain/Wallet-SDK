import { OnModuleInit } from "@nestjs/common";
import { BaseApp } from "../app";

export class WebApp extends BaseApp implements OnModuleInit {
    async onModuleInit() {
        await this.start();
    }
}
