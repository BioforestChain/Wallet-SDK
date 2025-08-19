import { ExternalChainName } from "@bnqkl/wallet-typings";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**获取外链打块间隔 */
export class GetExternalForgeIntervalReqDto {
    @IsNotEmpty()
    @ApiProperty({ description: "链名", enum: ExternalChainName })
    chainName!: ExternalChainName;
}
