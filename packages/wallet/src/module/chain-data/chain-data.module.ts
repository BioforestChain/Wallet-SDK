import { forwardRef, Module } from "@nestjs/common";
import { ExternalChainTransModule } from "../external-chain-trans/external-chain-trans.module.js";
import { InternalChainTransModule } from "../internal-chain-trans/internal-chain-trans.module.js";
import { ChainDataController } from "./chain-data.controller.js";

@Module({
    imports: [forwardRef(() => ExternalChainTransModule), forwardRef(() => InternalChainTransModule)],
    controllers: [ChainDataController],
    providers: [],
    exports: [],
})
export class ChainDataModule {}
