import { Injectable } from "@nestjs/common";
import type { DataSource } from "typeorm";
import { BaseRepository } from "@bnqkl/wallet-sdk";
import { NotifyEntity } from "../../common/entity/notify.entity.js";

@Injectable()
export class NotifyRepository extends BaseRepository<NotifyEntity> {
    constructor(dataSource: DataSource) {
        super(NotifyEntity, dataSource);
    }
}
