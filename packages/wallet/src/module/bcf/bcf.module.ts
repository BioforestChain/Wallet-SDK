import { Module, forwardRef } from "@nestjs/common";
import {
    BFChainV2Service,
    BfmChainService,
    BIWMetaService,
    BTCMetaService,
    BTGMetaService,
    CcchainService,
    ETHMetaService,
    PMChainService,
    BfmetaV2Service,
} from "./bcf.service";
import {
    BFChainV2Controller,
    BfmChainController,
    BIWMetaController,
    BTCMetaController,
    BTGMetaController,
    CcchainController,
    ETHMetaController,
    PMChainController,
    BfmetaV2Controller,
} from "./bcf.controller";
import { RedisModule } from "../redis/redis.module";
import {
    BFChainV2TransactionsRepository,
    BfmchainTransactionsRepository,
    BIWMetaTransactionsRepository,
    BTCMetaTransactionsRepository,
    BTGMetaTransactionsRepository,
    CcchainTransactionsRepository,
    ETHMetaTransactionsRepository,
    PmchainTransactionsRepository,
    BfmetaV2TransactionsRepository,
} from "./bcf.repository";
import { NotifyModule } from "../notify/notify.module";

@Module({
    imports: [forwardRef(() => RedisModule), forwardRef(() => NotifyModule)],
    controllers: [
        BfmChainController,
        BFChainV2Controller,
        CcchainController,
        PMChainController,
        ETHMetaController,
        BTCMetaController,
        BTGMetaController,
        BIWMetaController,
        BfmetaV2Controller,
    ],
    providers: [
        BfmChainService,
        BFChainV2Service,
        CcchainService,
        PMChainService,
        ETHMetaService,
        BTCMetaService,
        BTGMetaService,
        BIWMetaService,
        BfmetaV2Service,
        BfmchainTransactionsRepository,
        BFChainV2TransactionsRepository,
        CcchainTransactionsRepository,
        PmchainTransactionsRepository,
        ETHMetaTransactionsRepository,
        BTCMetaTransactionsRepository,
        BTGMetaTransactionsRepository,
        BIWMetaTransactionsRepository,
        BfmetaV2TransactionsRepository,
    ],
    exports: [
        BfmChainService,
        BFChainV2Service,
        CcchainService,
        PMChainService,
        ETHMetaService,
        BTCMetaService,
        BTGMetaService,
        BIWMetaService,
        BfmetaV2Service,
    ],
})
export class BCFModule {}
