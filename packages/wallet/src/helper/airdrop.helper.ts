import { CommonHelper } from "@bnqkl/wallet-sdk";
import { ENTITY_ID_MAX_LENGTH, NORMAL_DP_NO } from "../common";

export class AirdropHelper {
    /**
     * 生成默认转移资产交易id
     * @param orderId
     * @param dpNo
     */
    static genDefaultTransferTxId(orderId: string, dpNo: number): string {
        if (dpNo === NORMAL_DP_NO) {
            return orderId;
        }
        return `${orderId}_${dpNo}`;
    }

    /**
     * 生成发行资产的entityId
     */
    static genIssueEntityId(): string {
        return CommonHelper.getRandomChar(ENTITY_ID_MAX_LENGTH).toLowerCase();
    }

    /**
     * 生成批量发行资产的entity列表
     * @param quantity
     * @param taxAssetPrealnum
     * @returns
     */
    static genIssueEntityMultiStructList(quantity: number, taxAssetPrealnum?: string): { entityId: string; taxAssetPrealnum?: string }[] {
        const entityNumLen = String(quantity).length;
        const entityIdPrefix = CommonHelper.getRandomChar(ENTITY_ID_MAX_LENGTH - entityNumLen).toLowerCase();
        let entityStructList: { entityId: string; taxAssetPrealnum?: string }[] = [];
        for (let index = 0; index < quantity; index++) {
            const entityId = `${entityIdPrefix}${CommonHelper.addZero(String(index + 1), entityNumLen)}`;
            entityStructList.push({ entityId, taxAssetPrealnum });
        }
        return entityStructList;
    }

    /**
     * 生成转移资产的entityId
     * @param issueEntityId
     * @param quantity
     * @param dpNo
     * @returns
     */
    static genTransferDpEntityId(issueEntityId: string, quantity: number, dpNo: number): string {
        const entityNumLen = String(quantity).length;
        const entityIdPrefix = issueEntityId.substring(0, issueEntityId.length - entityNumLen);
        return `${entityIdPrefix}${CommonHelper.addZero(dpNo.toString(), entityNumLen)}`;
    }
}
