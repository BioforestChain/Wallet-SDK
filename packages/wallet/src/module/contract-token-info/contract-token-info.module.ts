import { forwardRef, Module } from "@nestjs/common";
import { ContractTokenInfoController } from "./contract-token-info.controller.js";
import { ContractTokenInfoRepository, ContractTokenInfoService } from "./contract-token-info.service.js";

@Module({
    imports: [],
    controllers: [ContractTokenInfoController],
    providers: [ContractTokenInfoService, ContractTokenInfoRepository],
    exports: [ContractTokenInfoService],
})
export class ContracTokenInfoModule {}
