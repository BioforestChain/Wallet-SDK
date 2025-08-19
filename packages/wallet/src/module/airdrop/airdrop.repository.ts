import { Injectable } from "@nestjs/common";
import { AirdropOrder, AirdropTransferTx } from "../../common/index.js";
import type { DataSource } from "typeorm";
import { BaseRepository } from "@bnqkl/wallet-sdk";

@Injectable()
export class AirdropOrderRepository extends BaseRepository<AirdropOrder> {
    constructor(dataSource: DataSource) {
        super(AirdropOrder, dataSource);
    }
}

@Injectable()
export class AirdropTransferTxRepository extends BaseRepository<AirdropTransferTx> {
    constructor(dataSource: DataSource) {
        super(AirdropTransferTx, dataSource);
    }
}
