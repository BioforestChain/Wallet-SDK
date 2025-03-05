import { forwardRef, Module } from "@nestjs/common";
import { NotifyService } from "./notify.service";
import { NotifyRepository } from "./notify.repository";
import { NotifyController } from "./notify.controller";

@Module({
    imports: [],
    controllers: [NotifyController],
    providers: [NotifyService, NotifyRepository],
    exports: [NotifyService],
})
export class NotifyModule {}
