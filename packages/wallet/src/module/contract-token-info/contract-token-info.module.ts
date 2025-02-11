import { forwardRef, Module } from "@nestjs/common";
import { ContractTokenInfoController } from "./contract-token-info.controller";
import { ContractTokenInfoRepository, ContractTokenInfoService } from "./contract-token-info.service";

@Module({
    imports: [],
    controllers: [ContractTokenInfoController],
    providers: [ContractTokenInfoService, ContractTokenInfoRepository],
    exports: [ContractTokenInfoService],
})
export class ContracTokenInfoModule {}
