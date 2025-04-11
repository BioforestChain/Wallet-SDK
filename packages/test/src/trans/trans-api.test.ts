import { Injectable } from "@nestjs/common";
import { CommonTest } from "../common/common.test";
import { CHAIN_NETWORK_TYPE, ChainHelper, InternalChainName, Logger, redisCore, staticConfig, transactionMaker } from "@bnqkl/wallet";
import { TransApi } from "../api/trans.api";
import { BSC_MNEMONIC, INCREASE_ASSET_FROZEN_ADDRESS, INCREASE_ASSET_NAME, INCREASE_ASSET_SECRET, TEST_STAKE_ID } from "../constant";
import * as fs from "fs";
import { ExternalTransferApi } from "../api/external-transfer.api";

@Injectable()
export class TransApiTest extends CommonTest {
    async execute() {
        await redisCore.connect(staticConfig.redis.server);

        let funcNames: (keyof TransApiTest)[] = [];
        funcNames.push("test");

        for (let idx = 0; idx < funcNames.length; idx++) {
            const funcName = funcNames[idx];
            const promise = (this[funcName] as () => Promise<any>)();
            if (!promise) {
                continue;
            }
            try {
                const value = await promise;
                let data = `idx: ${idx} name: ${funcNames[idx]} --- ${JSON.stringify(value, null, 2)}`;
                Logger.debug(data);
            } catch (e) {
                let data = `error. idx: ${idx} name: ${funcNames[idx]} ---`;
                Logger.debug(data, e);
            }
        }
    }

    async test() {
        // await this.uploadFiles();
        // await this.transferWithPicture();
        await this.simpleTransfer();
        // await this.createIssueEntityFactory();
        // await this.assetTest();
        // await this.simpleBscTransfer();
    }

    async uploadFiles() {
        const res = await this.walletServerSdk.uploadFiles({
            files: [fs.createReadStream("C:\\Users\\huangchao\\Pictures\\aaa.png"), fs.createReadStream("C:\\Users\\huangchao\\Pictures\\666.png")],
        });
        Logger.debug(`uploadFiles done. res =`, res);
    }

    /**
     * 简单转账
     */
    async simpleTransfer() {
        const { info, network } = (await this.getLoginAccounts())[0];
        const chainName = InternalChainName.BIWMETA;
        const maker = await transactionMaker.getTrMaker(chainName);
        const amount = "50000";
        const param: TransactionMaker.Transaction.TransferAssetTransactionParams = {
            secret: "mimic elephant list lizard deputy autumn already tomorrow arm carpet front victory silly avoid globe town twin exercise nose extend divorce imitate basic puppy",
            fee: "10000",
            recipientId: "b7jTEcjyVYy2jMG9DA7dARrNSAJDaRGUQA",
            applyBlockHeight: await TransApi.getLastblockHeight(chainName, network),
            assetInfo: {
                amount: amount,
                assetType: ChainHelper.getInternalMainAssetType(chainName, staticConfig.chainConfig.chainNetworkType === CHAIN_NETWORK_TYPE.TESTNET),
            },
        };
        const ret = await maker.transaction.generateTransferAsset(param);
        if (!ret.success) {
            throw ret;
        }
        const trJson = ret.result as WalletTypings.InternalChain.TransferAssetTransaction;
        Logger.debug(`transactionJSON = `, JSON.stringify(trJson, null, 2));
        const res = await TransApi.broadcastTransactionNotify(
            chainName,
            {
                notifyUrl: "http://35.213.16.141:28003/api/basic/getTransactions?minHeight=1&tid=123456",
                toAddress: trJson.recipientId,
                fromAddress: trJson.senderId,
                amount: amount,
                timestamp: 123,
                signature: trJson.signature,
                publickey: trJson.senderPublicKey,
                trsInfo: {
                    chain: InternalChainName.BIWMETA,
                    info: {
                        assetType: "BIW",
                        trs: trJson,
                        trsId: trJson.signature,
                    },
                },
            },
            network,
        );
        console.log(res);
        Logger.debug(`broadcastTransaction done.`);
    }

    async createIssueEntityFactory() {
        const { info } = (await this.getLoginAccounts())[0];
        return await this.walletServerSdk.createIssueEntityFactory({
            chainName: InternalChainName.BIWMETA,
            secret: info.secret,
            recipientId: info.address,
            issueFactoryInfo: {
                factoryId: "hchc6666",
                entityPrealnum: "5000",
                entityFrozenAssetPrealnum: "0",
                purchaseAssetPrealnum: "0",
            },
        });
    }

    async assetTest() {
        const { info } = (await this.getLoginAccounts())[0];
        await this.walletServerSdk.createInternalIncreaseAsset({
            chainName: InternalChainName.BTGMETA,
            secret: INCREASE_ASSET_SECRET,
            recipientId: info.address,
            assetInfo: {
                applyAddress: INCREASE_ASSET_FROZEN_ADDRESS,
                assetType: INCREASE_ASSET_NAME,
                increasedAssetPrealnum: "100000",
            },
        });
        await this.walletServerSdk.createInternalDestroyAsset({
            chainName: InternalChainName.BTGMETA,
            secret: info.secret,
            recipientId: INCREASE_ASSET_FROZEN_ADDRESS,
            assetInfo: {
                assetType: INCREASE_ASSET_NAME,
                amount: "30000",
            },
        });
        await this.walletServerSdk.createInternalStakeAsset({
            chainName: InternalChainName.BTGMETA,
            secret: info.secret,
            assetInfo: {
                assetType: INCREASE_ASSET_NAME,
                assetPrealnum: "30000",
            },
            stakeId: TEST_STAKE_ID,
            numberOfUnstakeHeight: 5,
        });
        await this.walletServerSdk.createInternalUnstakeAsset({
            chainName: InternalChainName.BTGMETA,
            secret: info.secret,
            assetInfo: {
                assetType: INCREASE_ASSET_NAME,
                assetPrealnum: "15000",
            },
            stakeId: TEST_STAKE_ID,
        });
    }

    /**
     * bsc简单转账
     */
    async simpleBscTransfer() {
        const contractAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
        const recipientAddress = "0x3549613447bD0B04d9862c6c2Ad847D1B4Aa1a8A";
        const { rawTrans, txHash } = await ExternalTransferApi.bscTransfer(
            {
                account: {
                    mnemonic: BSC_MNEMONIC,
                },
                to: recipientAddress,
                contractAddress,
                amount: "10000",
            },
            this.defaultNetwork,
        );
        Logger.debug(`simpleBscTransfer <bsc> rawTrans:${rawTrans} txHash:${txHash}`);
        const res = await TransApi.bscBroadcastDirect(
            {
                signTransData: rawTrans,
            },
            this.defaultNetwork,
        );
        Logger.debug(`simpleBscTransfer <bsc> done. `, res);
    }
}
