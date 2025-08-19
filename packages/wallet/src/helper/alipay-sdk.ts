import type { AlipaySdkConfig } from "alipay-sdk";
import { AlipaySdk } from "alipay-sdk";
import { staticConfig } from "../config/index.js";

const defaultConfig: AlipaySdkConfig = {
    appId: "appId",
    privateKey: "privateKey",
    alipayPublicKey: "alipayPublicKey",
    gateway: "gateway",
    camelcase: false,
};
export const alipaySdk = new AlipaySdk(staticConfig.alipay ?? defaultConfig);
