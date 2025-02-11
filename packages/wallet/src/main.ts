process.env["workerName"] = "master";
process.env.NODE_ENV = "dev";
process.env["VERSION"] = "1.5.0";
process.env["PROJECT_NAME"] = "WALLET";
process.env["serverKey"] = "serverKey";
process.env["clientPublicKey"] = "f116f553fd9d6201bc591dc030346bb0e14a4c96103df3e7f8ece17ae9a02d15";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@bnqkl/wallet-sdk";
(async () => {
    const app = await NestFactory.create(AppModule);
    await app.init();
})().catch(async (err) => {
    Logger.error(err);
});
