import { ApiProperty } from "@nestjs/swagger";
import { BFChainTransInBlockDto } from "./bfchain-trans-in-block.dto";

export class BFChainBrowserTransactionInBlockDto implements BFChainWallet.BCF.GetTransactionsByBrowserResp {
    @ApiProperty()
    page: number;
    @ApiProperty()
    pageSize: number;
    @ApiProperty()
    total: number;
    @ApiProperty()
    hasMore: boolean;
    @ApiProperty({ type: BFChainTransInBlockDto })
    dataList: BFChainTransInBlockDto[];
}
