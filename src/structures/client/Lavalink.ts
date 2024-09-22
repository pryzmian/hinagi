import type { LavalinkManagerEvents, NodeManagerEvents } from "lavalink-client";
import type { AllEvents, LavalinkEvent, LavalinkEventRun, LavalinkEventType } from "#hinagi/types";

/**
 * Stelle Lavalink events main class.
 */
export class Lavalink<K extends keyof AllEvents = keyof AllEvents> implements LavalinkEvent<K> {
    readonly name: K;
    readonly type: LavalinkEventType<K>;
    readonly run: LavalinkEventRun<K>;

    constructor(event: LavalinkEvent<K>) {
        this.name = event.name;
        this.type = event.type;
        this.run = event.run;
    }

    public isNode(): this is LavalinkNode {
        return this.type === "node";
    }

    public isManager(): this is LavalinkManager {
        return this.type === "manager";
    }
}

type LavalinkNode = Lavalink<keyof NodeManagerEvents>;
type LavalinkManager = Lavalink<keyof LavalinkManagerEvents>;
