import type { OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GLOBAL_INITING, redisCore } from "@bnqkl/wallet-sdk";
import { BaseApp } from "../app.js";
import { UpgradeService } from "../../module/upgrade/upgrade.service.js";

@Injectable()
export class GlobalApp extends BaseApp implements OnModuleInit, OnApplicationBootstrap {
    @Inject(forwardRef(() => UpgradeService))
    private __upgradeService!: UpgradeService;

    async onModuleInit() {
        await this.start();
        await this.__upgradeService.upgrade();
    }

    async onApplicationBootstrap() {
        await redisCore.redis.del(GLOBAL_INITING);
    }
}
