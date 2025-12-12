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
        BfmchainTransactionsRepository,
        BFChainV2TransactionsRepository,
        CcchainTransactionsRepository,
        PmchainTransactionsRepository,
        ETHMetaTransactionsRepository,
        BTCMetaTransactionsRepository,
        BTGMetaTransactionsRepository,
        BIWMetaTransactionsRepository,
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
    ],
})
export class BCFModule {}
