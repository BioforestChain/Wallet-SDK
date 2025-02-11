process.env["workerName"] = "test";

import { NestFactory } from "@nestjs/core";
import { TestModule } from "./test.module";
import { Logger } from "@bnqkl/wallet";

(async () => {
    const app = await NestFactory.create(TestModule);
    await app.init();
})().catch(async (err) => {
    Logger.error(err);
});
