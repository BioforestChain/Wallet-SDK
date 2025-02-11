export * from "./wallet.publisher";

import { staticConfig } from "../../config";
import { WalletConsumer } from "@bnqkl/wallet-sdk";
import { WalletPublisher } from "./wallet.publisher";
import { BusinessConsumer } from "./business.consumer";
import { BusinessPublisher } from "./business.publisher";

export const walletPublisher = new WalletPublisher(staticConfig.rabbitMQ.server);
export const walletConsumer = new WalletConsumer(staticConfig.rabbitMQ.server);

export const businessPublisher = new BusinessPublisher(staticConfig.rabbitMQ.server);
export const businessConsumer = new BusinessConsumer(staticConfig.rabbitMQ.server);
