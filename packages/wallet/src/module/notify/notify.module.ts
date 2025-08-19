import { forwardRef, Module } from "@nestjs/common";
import { NotifyService } from "./notify.service.js";
import { NotifyRepository } from "./notify.repository.js";
import { NotifyController } from "./notify.controller.js";

@Module({
    imports: [],
    controllers: [NotifyController],
    providers: [NotifyService, NotifyRepository],
    exports: [NotifyService],
})
export class NotifyModule {}
