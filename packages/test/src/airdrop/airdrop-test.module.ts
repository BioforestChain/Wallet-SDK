import { Module } from "@nestjs/common";
import { AirdropApiTest } from "./airdrop-api.test.js";

@Module({
    imports: [],
    providers: [AirdropApiTest],
    exports: [AirdropApiTest],
})
export class AirdropTestModule {}
