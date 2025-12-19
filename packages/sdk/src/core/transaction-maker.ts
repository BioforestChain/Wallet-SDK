import { BFMetaTrMaker } from "@bfmeta/transaction-maker-api";
import { sleep } from "@bnqkl/server-util";
import { PromiseOut } from "@bnqkl/util-node";
import { InternalChainName } from "@bnqkl/wallet-typings";

export class TransactionMaker {
    private __pmchainTransactionMaker!: PromiseOut<BFMetaTrMaker>;
    private __ethmchainTransactionMaker!: PromiseOut<BFMetaTrMaker>;
    private __bfchainV2TransactionMaker!: PromiseOut<BFMetaTrMaker>;
    private __bfmchainTransactionMaker!: PromiseOut<BFMetaTrMaker>;
    private __ccchainTransactionMaker!: PromiseOut<BFMetaTrMaker>;
    private __btgmetaTransactionMaker!: PromiseOut<BFMetaTrMaker>;
    private __biwmetaTransactionMaker!: PromiseOut<BFMetaTrMaker>;
    private __bfmetachainTransactionMaker!: PromiseOut<BFMetaTrMaker>;

    constructor(public transactionMakerPort: WalletServerSdk.Config.CustomerConfig["chainConfig"]["transactionMakerPort"]) {}

    async getPmchainTransactionMaker() {
        if (this.__pmchainTransactionMaker) {
            return this.__pmchainTransactionMaker.promise;
        } else {
            const { ip, pmchain } = this.transactionMakerPort;
            this.__pmchainTransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${pmchain}`] });
            await sleep(1000);
            this.__pmchainTransactionMaker.resolve(maker);
            return maker;
        }
    }
    async getEthmchainTransactionMaker() {
        if (this.__ethmchainTransactionMaker) {
            return this.__ethmchainTransactionMaker.promise;
        } else {
            const { ip, ethmchain } = this.transactionMakerPort;
            this.__ethmchainTransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${ethmchain}`] });
            await sleep(1000);
            this.__ethmchainTransactionMaker.resolve(maker);
            return maker;
        }
    }

    async getBfchainV2TransactionMaker() {
        if (this.__bfchainV2TransactionMaker) {
            return this.__bfchainV2TransactionMaker.promise;
        } else {
            const { ip, bfchainv2 } = this.transactionMakerPort;
            this.__bfchainV2TransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${bfchainv2}`] });
            await sleep(1000);
            this.__bfchainV2TransactionMaker.resolve(maker);
            return maker;
        }
    }

    async getBFMChainTransactionMaker() {
        if (this.__bfmchainTransactionMaker) {
            return this.__bfmchainTransactionMaker.promise;
        } else {
            const { ip, bfmchain } = this.transactionMakerPort;
            this.__bfmchainTransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${bfmchain}`] });
            await sleep(1000);
            this.__bfmchainTransactionMaker.resolve(maker);
            return maker;
        }
    }

    async getCcchainTransactionMaker() {
        if (this.__ccchainTransactionMaker) {
            return this.__ccchainTransactionMaker.promise;
        } else {
            const { ip, ccchain } = this.transactionMakerPort;
            this.__ccchainTransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${ccchain}`] });
            await sleep(1000);
            this.__ccchainTransactionMaker.resolve(maker);
            return maker;
        }
    }

    async getBTGMetaTransactionMaker() {
        if (this.__btgmetaTransactionMaker) {
            return this.__btgmetaTransactionMaker.promise;
        } else {
            const { ip, btgmeta } = this.transactionMakerPort;
            this.__btgmetaTransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${btgmeta}`] });
            await sleep(1000);
            this.__btgmetaTransactionMaker.resolve(maker);
            return maker;
        }
    }

    async getBIWMetaTransactionMaker() {
        if (this.__biwmetaTransactionMaker) {
            return this.__biwmetaTransactionMaker.promise;
        } else {
            const { ip, biwmeta } = this.transactionMakerPort;
            this.__biwmetaTransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${biwmeta}`] });
            await sleep(1000);
            this.__biwmetaTransactionMaker.resolve(maker);
            return maker;
        }
    }

    async getBfmetaChainTransactionMaker() {
        if (this.__bfmetachainTransactionMaker) {
            return this.__bfmetachainTransactionMaker.promise;
        } else {
            const { ip, bfmetachain } = this.transactionMakerPort;
            this.__bfmetachainTransactionMaker = new PromiseOut<BFMetaTrMaker>();
            const maker = new BFMetaTrMaker({ ips: [`${ip ?? "127.0.0.1"}:${bfmetachain}`] });
            await sleep(1000);
            this.__bfmetachainTransactionMaker.resolve(maker);
            return maker;
        }
    }

    async getTrMaker(chainName: InternalChainName) {
        switch (chainName) {
            case InternalChainName.PMCHAIN:
                return this.getPmchainTransactionMaker();
            case InternalChainName.ETHMETA:
                return this.getEthmchainTransactionMaker();
            case InternalChainName.BFCHAINV2:
                return this.getBfchainV2TransactionMaker();
            case InternalChainName.BFMCHAIN:
                return this.getBFMChainTransactionMaker();
            case InternalChainName.CCCHAIN:
                return this.getCcchainTransactionMaker();
            case InternalChainName.BTGMETA:
                return this.getBTGMetaTransactionMaker();
            case InternalChainName.BIWMETA:
                return this.getBIWMetaTransactionMaker();
            case InternalChainName.BFMETACHAIN:
                return this.getBfmetaChainTransactionMaker();
            default:
                throw Error(`getTrMaker chainName:${chainName} error`);
        }
    }
}
