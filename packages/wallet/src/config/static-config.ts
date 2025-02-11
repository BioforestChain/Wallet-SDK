import { StaticConfigFactory } from "@bnqkl/wallet-sdk";
export const staticConfigFactory = new StaticConfigFactory<Wallet.Config.CustomerConfig>();
export const staticConfig = staticConfigFactory.getConfig();
