import type { OnModuleInit } from "@nestjs/common";
import { BaseApp } from "../app.js";

export class WebApp extends BaseApp implements OnModuleInit {
    async onModuleInit() {
        await this.start();
    }
}
