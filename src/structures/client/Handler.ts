import { BaseHandler } from "seyfert/lib/common/index.js";
import type { Lavalink } from "./Lavalink.js";

import { resolve } from "node:path";
import type { Hinagi } from "#hinagi/structures";

const isWindows = process.platform === "win32";
const isDebug = process.argv.includes("--debug");
const output = isWindows && isDebug ? "src" : "dist";

export class Handler extends BaseHandler {
    readonly client: Hinagi;

    constructor(client: Hinagi) {
        super(client.logger);
        this.client = client;
    }

    public async load() {
        const eventsDir = resolve(output, "lavalink");
        const files = await this.loadFilesK<{ default: Lavalink }>(await this.getFiles(eventsDir));

        for await (const file of files) {
            const path = file.path.split(process.cwd()).slice(1).join(process.cwd());
            const event: Lavalink = file.file.default;

            if (!event) {
                this.logger.warn(`${path} doesn't export by \`export default new Lavaink({ ... })\``);
                continue;
            }

            if (!event.name) {
                this.logger.warn(`${path} doesn't have a \`name\``);
                continue;
            }

            if (typeof event.run !== "function") {
                this.logger.warn(`${path} doesn't have a \`run\` function`);
                continue;
            }

            const run = (...args: any) => event.run(this.client, ...args);

            if (event.isNode()) this.client.manager.nodeManager.on(event.name, run);
            else if (event.isManager()) this.client.manager.on(event.name, run);
        }
    }
}
