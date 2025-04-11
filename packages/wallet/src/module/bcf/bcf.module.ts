import { Module, forwardRef } from "@nestjs/common";
import {
    BFChainV2Service,
    BfmChainService,
    BIWMetaService,
    BTCMetaService,
    BTGMetaService,
    CcchainService,
    ETHMetaService,
    MalibuService,
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
    MalibuController,
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
    MalibuTransactionsRepository,
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
        MalibuController,
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
        MalibuService,
        BfmchainTransactionsRepository,
        BFChainV2TransactionsRepository,
        CcchainTransactionsRepository,
        PmchainTransactionsRepository,
        ETHMetaTransactionsRepository,
        BTCMetaTransactionsRepository,
        BTGMetaTransactionsRepository,
        BIWMetaTransactionsRepository,
        MalibuTransactionsRepository
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
        MalibuService,
    ],
})
export class BCFModule {}
