import { Injectable } from "@nestjs/common";
import { CommonTest } from "../common/common.test.js";
import { $asyncAllNoNullMap, AIRDROP_TYPE, DP_FILE_TYPE, DP_LEVEL, InternalChainName, Logger, redisCore, staticConfig } from "@bnqkl/wallet";
import * as fs from "fs";

@Injectable()
export class AirdropApiTest extends CommonTest {
    private __remark: WalletTypings.Airdrop.DpRemark = {
        from: "Wallet",
        type: "json",
        version: "1.0.0",
        data: {
            name: "dp_sb",
            fileType: DP_FILE_TYPE.ORDINARY_PIC,
            level: DP_LEVEL.ORDINARY,
            links: "links",
            description: "description",
        },
        pic: "",
    };
    private __factoryInfo: WalletTypings.Airdrop.DpEntityFactoryInfo = {
        entityFactoryPossessor: "cCET2Sxt2LPDhx44wxJ9uhkpviKNrSacvE",
        entityFactory: {
            factoryId: "hchc6666",
            entityPrealnum: "5000",
            entityFrozenAssetPrealnum: "0",
            purchaseAssetPrealnum: "0",
        },
    };

    async execute() {
        await redisCore.connect(staticConfig.redis.server);

        let funcNames: (keyof AirdropApiTest)[] = [];
        funcNames.push("test");
        // funcNames.push("transferWithPicture");

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
        await this.airdropNormalDp();
        await this.airdropLimitedDp();
    }

    async airdropNormalDp() {
        const { info } = (await this.getLoginAccounts())[0];
        const res = await this.walletServerSdk.airdrop({
            chainName: InternalChainName.BIWMETA,
            airdropType: AIRDROP_TYPE.NORMAL,
            issueDpInfo: {
                remark: this.__remark,
                factoryInfo: this.__factoryInfo,
            },
            transferDpInfos: [{ address: info.address }],
            file: fs.createReadStream("C:\\Users\\huangchao\\Pictures\\aaa.png"),
        });
        Logger.debug(`airdropNormalDp done. `, res);
    }

    async airdropLimitedDp() {
        const { info } = (await this.getLoginAccounts())[0];
        const res = await this.walletServerSdk.airdrop({
            chainName: InternalChainName.BIWMETA,
            airdropType: AIRDROP_TYPE.LIMITED,
            issueDpInfo: {
                remark: this.__remark,
                factoryInfo: this.__factoryInfo,
                quantity: 10,
            },
            transferDpInfos: [
                { address: info.address, dpNo: 1 },
                { address: info.address, dpNo: 2 },
                { address: info.address, dpNo: 5 },
                { address: info.address, dpNo: 7 },
                { address: info.address, dpNo: 9 },
            ],
            file: fs.createReadStream("C:\\Users\\huangchao\\Pictures\\aaa.png"),
        });
        Logger.debug(`airdropLimitedDp done. `, res);
    }
}
