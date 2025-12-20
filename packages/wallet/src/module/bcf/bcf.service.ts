import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
    BFChainV2Transactions,
    BfmchainTransactions,
    BfmetaV2Transactions,
    BIWMetaTransactions,
    BTCMetaTransactions,
    BTGMetaTransactions,
    CcchainTransactions,
    ETHMetaTransactions,
    PMChainTransactions,
} from "../../common";
import { memTimeCache, MEM_TIME_CACHE_STRATEGY, InternalChainName, ERROR_CODE_ENUM, ERROR_CODE_OBJ, Result } from "@bnqkl/wallet-sdk";
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
import { walletSdk } from "../../helper";
import { BcfGetAssetsReqDto } from "./dto";
import { InternalChainTransService } from "../internal-chain-trans/internal-chain-trans.service";

@Injectable()
export class BfmChainService extends InternalChainTransService {
    @Inject(BfmchainTransactionsRepository)
    public readonly repository: BfmchainTransactionsRepository;

    constructor() {
        super(InternalChainName.BFMCHAIN);
    }

    newTransaction() {
        return new BfmchainTransactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class BFChainV2Service extends InternalChainTransService {
    @Inject(BFChainV2TransactionsRepository)
    public readonly repository: BFChainV2TransactionsRepository;

    constructor() {
        super(InternalChainName.BFCHAINV2);
    }

    newTransaction() {
        return new BFChainV2Transactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class CcchainService extends InternalChainTransService {
    @Inject(CcchainTransactionsRepository)
    public readonly repository: CcchainTransactionsRepository;

    constructor() {
        super(InternalChainName.CCCHAIN);
    }

    newTransaction() {
        return new CcchainTransactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    async sdkCreateTransferAsset(argv: BFMetaNodeSDK.Transaction.TransferAssetTransactionParams) {
        if (await walletSdk.stupidBlackAddressListCheck(argv.publicKey)) {
            return new Result().err(
                /**@FIXME 错误码多了以后再认真写 */
                ERROR_CODE_ENUM.INVAILD_ADDRESS,
                ERROR_CODE_OBJ[ERROR_CODE_ENUM.INVAILD_ADDRESS],
            ) as unknown as any;
        }
        return super.sdkCreateTransferAsset(argv);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class PMChainService extends InternalChainTransService {
    @Inject(PmchainTransactionsRepository)
    public readonly repository: PmchainTransactionsRepository;

    constructor() {
        super(InternalChainName.PMCHAIN);
    }

    newTransaction() {
        return new PMChainTransactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class ETHMetaService extends InternalChainTransService {
    @Inject(ETHMetaTransactionsRepository)
    public readonly repository: ETHMetaTransactionsRepository;

    constructor() {
        super(InternalChainName.ETHMETA);
    }

    newTransaction() {
        return new ETHMetaTransactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class BTCMetaService extends InternalChainTransService {
    @Inject(BTCMetaTransactionsRepository)
    public readonly repository: BTCMetaTransactionsRepository;

    constructor() {
        super(InternalChainName.BTCMETA);
    }

    newTransaction() {
        return new BTCMetaTransactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class BTGMetaService extends InternalChainTransService {
    @Inject(BTGMetaTransactionsRepository)
    public readonly repository: BTGMetaTransactionsRepository;

    constructor() {
        super(InternalChainName.BTGMETA);
    }

    newTransaction() {
        return new BTGMetaTransactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class BIWMetaService extends InternalChainTransService {
    @Inject(BIWMetaTransactionsRepository)
    public readonly repository: BIWMetaTransactionsRepository;

    constructor() {
        super(InternalChainName.BIWMETA);
    }

    newTransaction() {
        return new BIWMetaTransactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}

@Injectable()
export class BfmetaV2Service extends InternalChainTransService {
    @Inject(BfmetaV2TransactionsRepository)
    public readonly repository: BfmetaV2TransactionsRepository;

    constructor() {
        super(InternalChainName.BFMETAV2);
    }

    newTransaction() {
        return new BfmetaV2Transactions();
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssets(dto: BcfGetAssetsReqDto) {
        return await super.getAssets(dto);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_MINUTE })
    async getAssetDetails(assetType: string) {
        return await super.getAssetDetails(assetType);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_SECOND })
    async getLastBlock() {
        return await super.getLastBlock();
    }
}
