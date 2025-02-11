import { AirdropOrder, NORMAL_DP_NO } from "../../../common";
import { AirdropHelper } from "../../../helper";
import { AirdropOrderRepository, AirdropTransferTxRepository } from "../airdrop.repository";
import { AirdropOrderMgr } from "./airdrop-order-mgr";
import { AirdropOrderState } from "./state";
import {
    $noNullMap,
    AIRDROP_ORDER_STATE_ID,
    AIRDROP_TYPE,
    INTERNAL_TRANS_RETRY_INVERVAL,
    INTERNAL_TRANS_RETRY_MAX_NUM,
    Logger,
    OrderObj,
} from "@bnqkl/wallet-sdk";

/**空投订单的逻辑对象 */
export class AirdropOrderObj extends OrderObj<AIRDROP_ORDER_STATE_ID, AirdropOrderState, AirdropOrder> implements Wallet.Airdrop.OrderObj {
    /**发行事件重试时间戳 */
    public retryIssueTxStamp?: number;
    /**发行事件重试次数 */
    public retryIssueTxNum = 0;
    /**待上链的转移交易对象Map */
    public pendingTransferTxObjMap = new Map<string, Wallet.Airdrop.AirdropPendingTransferTxObj>();

    constructor(
        order: AirdropOrder,
        airdropOrderMgr: AirdropOrderMgr,
        repository: AirdropOrderRepository,
        public transferTxRepository: AirdropTransferTxRepository,
    ) {
        super(order, airdropOrderMgr, repository);
    }

    /**消息队列id */
    get mqId() {
        return this.entity.mqId;
    }

    /**空投类型名字 */
    get airdropType() {
        return AIRDROP_TYPE[this.entity.type];
    }

    /**空投类型 */
    get type() {
        return this.entity.type;
    }

    /**空投链名 */
    get chainName() {
        return this.entity.chainName;
    }

    /**dp发行信息 */
    get issueDpInfo() {
        return this.entity.issueDpInfo;
    }

    /**空投发行交易id */
    get issueTxId() {
        return this.entity.issueTxId;
    }
    set issueTxId(txId: string) {
        this.entity.issueTxId = txId;
    }

    /**空投转移地址 */
    private get transferAddress() {
        return this.entity.transferAddress;
    }

    /**空投转移交易id */
    private get transferTxId() {
        return this.entity.transferTxId;
    }
    private set transferTxId(txId: string) {
        this.entity.transferTxId = txId;
    }

    async init() {
        await this.__loadPendingTransferTxObj();
        await super.init();
    }

    /**
     * 加载待上链的转移交易对象
     */
    private async __loadPendingTransferTxObj() {
        if (this.type === AIRDROP_TYPE.NORMAL) {
            this.pendingTransferTxObjMap.set(this.transferTxId, {
                transferAddress: this.transferAddress,
                transferTxId: this.transferTxId,
                dpNo: NORMAL_DP_NO,
                retryTransferTxNum: 0,
            });
        } else if (this.type === AIRDROP_TYPE.LIMITED) {
            // 只加载未上链的交易
            const transferTxArray = await this.transferTxRepository.findBy({ orderId: this.orderId, transferTxOnchain: false });
            $noNullMap(transferTxArray, ({ dpNo, address, transferTxId }) => {
                this.pendingTransferTxObjMap.set(transferTxId, {
                    transferAddress: address,
                    transferTxId,
                    dpNo,
                    retryTransferTxNum: 0,
                });
            });
        }
    }

    async getAllTransferTx() {
        return await this.transferTxRepository.findBy({ orderId: this.orderId });
    }

    getTransferTxObj(txId: string): Wallet.Airdrop.AirdropPendingTransferTxObj {
        const transferTxObj = this.pendingTransferTxObjMap.get(txId);
        if (!transferTxObj) {
            throw Error(`orderId:${this.orderId} txId:${txId} can't find transferTxObj`);
        }
        return transferTxObj;
    }

    async updateTransferTxOnChain(txId: string) {
        if (this.curStateId !== AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN) {
            throw Error(`updateTransferTxOnChain can't call in state:${AIRDROP_ORDER_STATE_ID[this.curStateId]}`);
        }
        await this.transferTxRepository.update({ transferTxId: txId }, { transferTxOnchain: true });
        // 成功后从内存中删除
        this.pendingTransferTxObjMap.delete(txId);
    }

    /**
     * 重试转移交易
     * @param txId
     */
    async retryTransferTx(txId: string) {
        await this.updateTransferTxId(txId);
    }

    /**
     * 更新转移资产的交易id
     * @param txId
     * @param newTxId
     * @returns
     */
    async updateTransferTxId(txId: string, newTxId?: string): Promise<string> {
        if (this.curStateId !== AIRDROP_ORDER_STATE_ID.TRANSFER_TX_WAIT_ON_CHAIN) {
            throw Error(`updateTransferTxId can't call in state:${AIRDROP_ORDER_STATE_ID[this.curStateId]}`);
        }
        const transferTxObj = this.pendingTransferTxObjMap.get(txId);
        if (!transferTxObj) {
            throw Error(`orderId:${this.orderId} txId:${txId} can't find transferTxObj`);
        }
        if (newTxId) {
            transferTxObj.transferTxId = newTxId;
            // 设置新映射
            this.pendingTransferTxObjMap.set(newTxId, transferTxObj);
            // 删除旧映射
            this.pendingTransferTxObjMap.delete(txId);
        } else {
            // retry
            transferTxObj.transferTxId = AirdropHelper.genDefaultTransferTxId(this.orderId, transferTxObj.dpNo);
            transferTxObj.retryTransferTxNum++;
            const txNum = transferTxObj.retryTransferTxNum;
            if (txNum > INTERNAL_TRANS_RETRY_MAX_NUM) {
                // 超过最大重试次数
                Logger.error(
                    `<${this.orderType}> airdropType:${this.airdropType} ${this.orderId} dpNo:${transferTxObj.dpNo} txNum:${txNum} is over ${INTERNAL_TRANS_RETRY_MAX_NUM}`,
                );
            } else {
                transferTxObj.retryTransferTxStamp = Date.now() + INTERNAL_TRANS_RETRY_INVERVAL;
                // 设置新映射
                this.pendingTransferTxObjMap.set(transferTxObj.transferTxId, transferTxObj);
                // 删除旧映射
                this.pendingTransferTxObjMap.delete(txId);
            }
        }
        if (transferTxObj.dpNo === NORMAL_DP_NO) {
            this.transferTxId = transferTxObj.transferTxId;
            await this.save();
        } else {
            await this.transferTxRepository.update({ orderId: this.orderId, dpNo: transferTxObj.dpNo }, { transferTxId: transferTxObj.transferTxId });
        }
        return transferTxObj.transferTxId;
    }

    /**
     * 是否所有待上链交易都超过了最大重试次数
     */
    isAllPendingTransRetryOverLimit() {
        for (const transferTxObj of this.pendingTransferTxObjMap.values()) {
            if (transferTxObj.retryTransferTxNum <= INTERNAL_TRANS_RETRY_MAX_NUM) {
                return false;
            }
        }
        return true;
    }

    /**
     * 开始发行交易上链回调
     */
    async onIssueTxStartCallback(): Promise<void> {
        await this.curState?.onIssueTxStartCallback(this);
    }

    /**
     * 进入转移状态回调
     * @param orderObj
     */
    async onEnterTransferStateCallback(): Promise<void> {
        await this.curState?.onEnterTransferStateCallback(this);
    }

    /**
     * 开始转移交易上链回调
     * @param txId
     */
    async onTransferTxStartCallback(txId: string): Promise<void> {
        await this.curState?.onTransferTxStartCallback(this, txId);
    }
}
