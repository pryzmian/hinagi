import config from "config";
import { Client } from "seyfert";
import { Middlewares } from "../middlewares";
import { handleMiddlewaresError } from "../utils/functions/onMiddlewaresError";
import { HookRegistry, Symbols } from "../utils/hooks";
import { BotConfig } from "../utils/types";

export class Hinagi extends Client {
    public constructor() {
        super({
            allowedMentions: {
                replied_user: false,
            },
            commands: {
                prefix: () => [config.get<BotConfig>("botConfig").prefix],
                reply: () => true,
                defaults: {
                    onMiddlewaresError: () => handleMiddlewaresError.bind(this),
                },
            },
        });

        this.run();
    }

    /**
     * Loads the client and its modules.
     * @returns A promise that resolves when the client is loaded.
     */
    public async run(): Promise<void> {
        HookRegistry.set(Symbols.kClient, this);
        this.setServices({
            middlewares: Middlewares,
            cache: {
                disabledCache: {
                    overwrites: true,
                    roles: true,
                    emojis: true,
                    channels: true,
                    threads: true,
                    stickers: true,
                    presences: true,
                    stageInstances: true,
                    bans: true,
                },
            },
        });
        await this.start();
        await this.uploadCommands();
    }
}
