import config from "config";
import { LavalinkManager } from "lavalink-client";
import type { GuildShardPayload, SearchResult } from "lavalink-client";
import { autoPlayFunction } from "#hinagi/functions";
import { Handler, type Hinagi } from "#hinagi/structures";
import type { PlayerConfig } from "#hinagi/types";

const playerConfig = config.get<PlayerConfig>("playerConfig");

export class Manager extends LavalinkManager {
    public handler: Handler;

    constructor(private readonly client: Hinagi) {
        super({
            nodes: playerConfig.nodes,
            sendToShard: (guildId: string, payload: GuildShardPayload) => {
                const shardId = this.client.gateway.calculateShardId(guildId);
                return this.client.gateway.send(shardId, payload);
            },
            playerOptions: {
                defaultSearchPlatform: playerConfig.defaultSearchPlatform,
                onEmptyQueue: {
                    autoPlayFunction,
                },
            },
        });

        this.handler = new Handler(client);
    }

    /**
     * Loads the player and event handler.
     */
    public async load(): Promise<void> {
        await this.handler.load();
        this.client.logger.info("LavalinkManager loaded");
    }

    /**
     * Checks if there are any available nodes to play music.
     * @returns Whether there are any available nodes to play music.
     */
    public isUseable(): boolean {
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
