import { Injectable } from "@nestjs/common";
import { BaseUpgradeService } from "@bnqkl/wallet-sdk";

@Injectable()
export class UpgradeService extends BaseUpgradeService {
    /**mysql版本号 */
    MYSQL_VERSION_KEY = "mysqlVersionKey-wallet";
    /**更新补丁版本号 */
    PATCH_VERSION_KEY = "patchVersionKey-wallet";

    /**补丁信息，将版本往下累加 */
    patchVersionsArray = [];
}
