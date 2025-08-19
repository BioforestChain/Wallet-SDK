import { staticConfig } from "../config.js";
import { CommonApp, rabbitMQCore, redisCore } from "@bnqkl/wallet-sdk";

export abstract class BaseApp extends CommonApp {
    async start() {
        await this.initIpc();
        await this.connectRedis();
    }

    async connectRedis() {
        await redisCore.connect(staticConfig.redis.server);
    }

    async connectMq() {
        await rabbitMQCore.getConnection(staticConfig.rabbitMQ.server);
    }
}
