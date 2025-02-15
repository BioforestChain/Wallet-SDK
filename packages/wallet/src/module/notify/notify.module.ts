import { forwardRef, Module } from "@nestjs/common";
import { NotifyService } from "./notify.service";
import { NotifyRepository } from "./notify.repository";

@Module({
    imports: [],
    controllers: [],
    providers: [NotifyService, NotifyRepository],
    exports: [NotifyService],
})
export class NotifyModule {}
 