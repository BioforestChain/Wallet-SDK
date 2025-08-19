import { HttpRequestMiddleware, Logger } from "@bnqkl/wallet-sdk";
import { Injectable } from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class WalletRequestMiddleware extends HttpRequestMiddleware {
    /**打印日志 */
    printLog(req: Request, startTimestamp: number) {
        const costTime = Date.now() - startTimestamp;
        const msg = `path:${req.path} costTime:${costTime} ms`;
        // 各链查余额时间较长，统一不打日志
        if (costTime > 200 && !req.path.includes("/balance")) {
            Logger.warn(msg);
        }
    }
}
