import { Module } from "@nestjs/common";
import { UpgradeService } from "./upgrade.service.js";

@Module({
    imports: [],
    providers: [UpgradeService],
    exports: [UpgradeService],
})
export class UpgradeModule {}
