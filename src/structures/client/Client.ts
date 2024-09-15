import config from "config";

import { Client } from "seyfert";
import { hinagiMiddlewares } from "#hinagi/middlewares";
import type { BotConfig } from "#hinagi/types";

import { deferReplyResponse, onMiddlewaresError, onOptionsError, onRunError } from "#hinagi/functions";
import { Manager } from "#hinagi/structures";
export class Hinagi extends Client {
    public readonly manager: Manager;

    public constructor() {
        super({
            allowedMentions: {
                replied_user: false,
            },
            commands: {
                prefix: () => [config.get<BotConfig>("botConfig").prefix],
                reply: () => true,
                deferReplyResponse,
                defaults: {
                    onMiddlewaresError,
                    onOptionsError,
                    onRunError,
                },
            },
        });

        this.manager = new Manager(this);
    }

    /**
     * Loads the client and its modules.
     * @returns A promise that resolves when the client is loaded.
     */
    public async run(): Promise<void> {
        this.setServices({
            middlewares: hinagiMiddlewares,
            cache: {
                disabledCache: {
                    overwrites: true,
                    roles: true,
                    emojis: true,
                    threads: true,
                    stickers: true,
                    channels: true,
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
