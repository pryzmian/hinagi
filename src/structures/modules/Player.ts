import config from "config";
import { inject, injectable } from "inversify";
import { LavalinkManager } from "lavalink-client";
import type { GuildShardPayload, SearchResult } from "lavalink-client";
import type { PlayerConfig } from "../../utils/types";
import { Hinagi } from "../Client";

const playerConfig = config.get<PlayerConfig>("playerConfig");

@injectable()
export class Manager extends LavalinkManager {
    @inject(Hinagi) private readonly client!: Hinagi;

    public constructor() {
        super({
            nodes: playerConfig.nodes,
            sendToShard: (guildId: string, payload: GuildShardPayload) =>
                this.client.gateway.send(this.client.gateway.calculateShardId(guildId), payload),
            playerOptions: {
                defaultSearchPlatform: playerConfig.defaultSearchPlatform,
            },
        });
        this.load();
    }

    /**
     * Loads the player and event handler.
     */
    public async load(): Promise<void> {
        this.client.logger.info("Lavalink Manager has been initialized");
    }

    /**
     * Checks if there are any available nodes to play music.
     * @returns Whether there are any available nodes to play music.
     */
    public isNodeAvailable(): boolean {
        return this.nodeManager.nodes.filter((node) => node.connected).size > 0;
    }

    /**
     * Searches for the specified query.
     * @param query - The search query.
     * @param requesterUser - The user requesting the song.
     * @returns The search result.
     */
    public async search(query: string, requesterUser: unknown): Promise<SearchResult> {
        const node = this.nodeManager.leastUsedNodes()[0];
        return node.search(query, requesterUser);
    }
}
