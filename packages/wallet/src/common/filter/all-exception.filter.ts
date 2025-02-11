import { AllExceptionFilter, Logger } from "@bnqkl/wallet-sdk";
import { Catch } from "@nestjs/common";

/**
 * 全局异常捕获过滤器
 */
@Catch()
export class WalletAllExceptionFilter extends AllExceptionFilter {
    /**打印日志 */
    printLog(data: any) {
        // 不打印私钥
        if (data.body && data.body.secret) {
            delete data.body.secret;
        }
        if (data.body && data.body.account) {
            delete data.body.account;
        }
        Logger.error(data);
    }
}
