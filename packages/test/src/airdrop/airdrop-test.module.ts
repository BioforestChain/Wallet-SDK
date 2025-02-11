import { Module } from "@nestjs/common";
import { AirdropApiTest } from "./airdrop-api.test";

@Module({
    imports: [],
    providers: [AirdropApiTest],
    exports: [AirdropApiTest],
})
export class AirdropTestModule {}
