import { forwardRef, Module } from "@nestjs/common";
import { ExternalChainTransModule } from "../external-chain-trans/external-chain-trans.module";
import { InternalChainTransModule } from "../internal-chain-trans/internal-chain-trans.module";
import { ChainDataController } from "./chain-data.controller";

@Module({
    imports: [forwardRef(() => ExternalChainTransModule), forwardRef(() => InternalChainTransModule)],
    controllers: [ChainDataController],
    providers: [],
    exports: [],
})
export class ChainDataModule {}
