export * from "./wallet.publisher.js";

import { staticConfig } from "../../config.js";
import { WalletConsumer } from "@bnqkl/wallet-sdk";
import { WalletPublisher } from "./wallet.publisher.js";
import { BusinessConsumer } from "./business.consumer.js";
import { BusinessPublisher } from "./business.publisher.js";

export const walletPublisher = new WalletPublisher(staticConfig.rabbitMQ.server);
export const walletConsumer = new WalletConsumer(staticConfig.rabbitMQ.server);

export const businessPublisher = new BusinessPublisher(staticConfig.rabbitMQ.server);
export const businessConsumer = new BusinessConsumer(staticConfig.rabbitMQ.server);
