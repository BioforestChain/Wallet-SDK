import { forwardRef, Inject, OnModuleInit } from "@nestjs/common";
import { TransApiTest } from "./trans/trans-api.test";
import { AirdropApiTest } from "./airdrop/airdrop-api.test";

export class TestApp implements OnModuleInit {
    @Inject(forwardRef(() => TransApiTest))
    private __transApiTest!: TransApiTest;
    @Inject(forwardRef(() => AirdropApiTest))
    private __airdropApiTest!: AirdropApiTest;

    async onModuleInit() {
        const flag = process.argv[2];
        let exit = true;
        switch (flag) {
            case "--trans":
                await this.__transApiTest.execute();
                break;
            case "--airdrop":
                await this.__airdropApiTest.execute();
                break;
            default:
                break;
        }
        console.info(`test success!`);
        if (exit) {
            process.exit(0);
        }
    }
}
