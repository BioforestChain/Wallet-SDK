import { Injectable } from "@nestjs/common";
import { REDIS_REPOSITORY_NAME } from "../../common/constants/index.js";
import { RedisRepository } from "@bnqkl/wallet-sdk";

/**链信息的Redis仓库 */
@Injectable()
export class ChainInfoRedisRepository extends RedisRepository {
    constructor() {
        super(REDIS_REPOSITORY_NAME.CHAIN_INFO);
    }
}
