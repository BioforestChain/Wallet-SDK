import { Body, Controller, forwardRef, Inject, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { NotifyService } from "./notify.service";
import { GetNotifyListDto, RestartAppDto, UpdateNotifyDto } from "./dto/notify.dto";
import { NotifyEntity } from "../../common/entity/notify.entity";

@ApiTags("NOTIFY")
@Controller()
export class NotifyController {
    @Inject(forwardRef(() => NotifyService))
    private __notifyService!: NotifyService;

    @Post("notify/list")
    @ApiOperation({ summary: "list", description: "notify/list" })
    async getNotifyList(@Body() dto: GetNotifyListDto): Promise<NotifyEntity[]> {
        return await this.__notifyService.listNotify(dto);
    }

    @Post("notify/update")
    @ApiOperation({ summary: "update", description: "notify/update" })
    async updateNotify(@Body() dto: UpdateNotifyDto): Promise<NotifyEntity> {
        if (dto.verifyKey !== process.env["clientPublicKey"]) {
            throw Error(`invaild verifyKey`);
        }
        return await this.__notifyService.updateNotify(dto);
    }

    @Post("notify/restart")
    @ApiOperation({ summary: "restart", description: "notify/restart" })
    async restartApp(@Body() dto: RestartAppDto) {
        if (dto.verifyKey !== process.env["clientPublicKey"]) {
            throw Error(`invaild verifyKey`);
        }
        return await this.__notifyService.restartApp(dto);
    }
}
