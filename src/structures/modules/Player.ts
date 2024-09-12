import config from "config";
import { injectable } from "inversify";
import { LavalinkManager } from "lavalink-client";
import type { GuildShardPayload, SearchResult } from "lavalink-client";
import type { User } from "seyfert";
import type { PlayerConfig } from "../../utils/types";
import type { Hinagi } from "../Client";

const playerConfig = config.get<PlayerConfig>("playerConfig");

@injectable()
export class Manager extends LavalinkManager {
    constructor(private readonly client: Hinagi) {
        super({
            nodes: playerConfig.nodes,
            sendToShard: (guildId: string, payload: GuildShardPayload) => {
                const shardId = client.gateway.calculateShardId(guildId);
                return client.gateway.send(shardId, payload);
            },
            playerOptions: {
                defaultSearchPlatform: playerConfig.defaultSearchPlatform,
                requesterTransformer: (requester: unknown) => client.users.fetch((requester as User).id),
            },
        });
        this.load();
    }

    /**
     * Loads the player and event handler.
     */
    public async load(): Promise<void> {
        this.client.logger.info("Lavalink Manager loaded");
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
