import type { LavalinkManagerEvents, NodeManagerEvents } from "lavalink-client";
import type { UsingClient } from "seyfert";
import type { Awaitable } from "seyfert/lib/common/index.js";

export enum DestroyReason {
    NoResultsFound = "no results found for the provided query.",
    ChangedChannel = "the voice channel was changed.",
    QueueEmpty = "the queue is empty.",
    NodeDestroyed = "the node was destroyed.",
    NodeDeleted = "the node was deleted.",
    LavalinkNoVoice = "the Lavalink node has no voice channel associated with it.",
    NodeReconnectFail = "the node failed to reconnect.",
    Disconnected = "the client disconnected from the server.",
    PlayerReconnectFail = "the player failed to reconnect.",
    ChannelDeleted = "the voice channel was deleted.",
    DisconnectAllNodes = "all nodes were disconnected.",
    ReconnectAllNodes = "all nodes were reconnected.",
}

export type AllEvents = LavalinkManagerEvents & NodeManagerEvents;
export type LavalinkEventRun<K extends keyof AllEvents> = (client: UsingClient, ...args: Parameters<AllEvents[K]>) => Awaitable<any>;
export type LavalinkEventType<K extends keyof AllEvents> = K extends keyof NodeManagerEvents ? "node" : "manager";

export interface LavalinkEvent<K extends keyof AllEvents> {
    /** The event name. */
    name: K;
    /** The event type. */
    type: LavalinkEventType<K>;
    /** The event run. */
    run: LavalinkEventRun<K>;
}
