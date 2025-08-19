import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import express from "express";
import helmet from "helmet";
import type http from "node:http";
import { CHAIN_NETWORK_TYPE, CommonTransformIterceptor, Logger, WALLET_GLOBAL_PREFIX } from "@bnqkl/wallet-sdk";
import { VERSION } from "../common/constants.js";
import { WalletAllExceptionFilter } from "../common.js";
import { staticConfig } from "../config.js";

export abstract class BaseWorker {
    server!: http.Server;
    /**
     * nestModule的初始化
     * @param app
     */
    async initAppModule(app: INestApplication) {
        app.use(express.json({ limit: "50mb" }));
        app.use(express.urlencoded({ limit: "50mb", extended: true }));
        // 跨域处理
        app.enableCors();
        // XSS 安全预防
        app.use(helmet.xssFilter());
        // iframe 访问策略，预防点击劫持
        app.use(helmet.frameguard());
        // 隐藏 X-Powered-By 头信息
        app.use(helmet.hidePoweredBy());
        // 静止MIME类型嗅探
        app.use(helmet.noSniff());

        app.setGlobalPrefix(WALLET_GLOBAL_PREFIX);
        // 添加全局验证管道
        app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true, transform: true }));
        // 全局异常过滤器
        app.useGlobalFilters(new WalletAllExceptionFilter());
        app.useGlobalInterceptors(new CommonTransformIterceptor());
        if (staticConfig.docs) {
            const config = new DocumentBuilder()
                .setTitle("Wallet Doc")
                .setDescription("API description")
                .setVersion(VERSION)
                .addBearerAuth(
                    {
                        description: "add header",
                        name: "Authorization",
                        type: "http",
                        in: "Header",
                        bearerFormat: "Bearer",
                    },
                    "access-token",
                )
                .addSecurityRequirements("access-token")
                .addTag("Wallet")
                .build();
            const document = SwaggerModule.createDocument(app, config);
            SwaggerModule.setup("api", app, document);
        }
        await this.serverListen(app);
    }

    abstract getHttpPort(): number | undefined;

    async serverListen(app: INestApplication) {
        const port = this.getHttpPort();
        if (port !== undefined) {
            // Start Webserver
            this.server = await app.listen(port, () => {
                Logger.info(`Server Started! listening: ${port}`);
            });
        } else {
            await app.init();
        }
    }
}
