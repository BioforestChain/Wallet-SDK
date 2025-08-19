import { AlipaySdk, AlipaySdkConfig } from "alipay-sdk";
import { staticConfig } from "../config.js";

const defaultConfig: AlipaySdkConfig = {
    appId: "appId",
    privateKey: "privateKey",
    alipayPublicKey: "alipayPublicKey",
    gateway: "gateway",
    camelcase: false,
};
export const alipaySdk = new AlipaySdk(staticConfig.alipay ?? defaultConfig);
