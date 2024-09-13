import config from "config";
import container from "../container";

import { injectable } from "inversify";
import { Client } from "seyfert";
import { Middlewares } from "../middlewares";
import type { BotConfig } from "../utils/types";

import { deferReplyResponse, onMiddlewaresError, onOptionsError } from "../utils/functions";
import { Manager } from "./modules/Player";
@injectable()
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

        if (this.commands) {
            this.commands.onCommand = (file) => {
                return container.resolve(file);
            };

            this.commands.onSubCommand = (file) => {
                return container.resolve(file);
            };
        }

        await this.start();
        await this.uploadCommands();
    }
}
