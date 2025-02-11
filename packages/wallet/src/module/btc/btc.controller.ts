import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HttpHelper } from "@bfmeta/wallet-helpers";
import { BTCService } from "./btc.service";
import { staticConfig } from "../../config";
import { BTCBlockBookReqDto, BTCRPCReqDto } from "./dto/btc-rpc-req.dto";

@ApiTags("BTC")
@Controller("btc")
export class BTCController {
    httpHelper: HttpHelper;
    constructor(private readonly btcService: BTCService) {
        this.httpHelper = new HttpHelper();
    }

    @Post("rpc")
    @ApiOperation({ summary: "btc-rpc" })
    async btcRPC(@Body() dto: BTCRPCReqDto) {
        const apipath = staticConfig.chainConfig.chain.btc.rpcPath;
        const result: any = await this.httpHelper.sendPostRequest(apipath, dto);
        if (result.result) {
            return result.result;
        } else {
            return result;
        }
    }

    @Post("blockbook")
    @ApiOperation({ summary: "blockbook" })
    async blockbook(@Body() dto: BTCBlockBookReqDto) {
        const apipath = staticConfig.chainConfig.chain.btc.blockbookPath;
        const { url, body, method } = dto;
        if (method === "GET") {
            const result: any = await this.httpHelper.sendGetRequest(`${apipath}${url}`, {});
            if (result.result) {
                return result.result;
            } else {
                return result;
            }
        } else if (method === "POST") {
            const result: any = await this.httpHelper.sendPostRequest(`${apipath}${url}`, body);
            if (result.result) {
                return result.result;
            } else {
                return result;
            }
        } else {
            throw Error(`not support ${method}`);
        }
    }
}
