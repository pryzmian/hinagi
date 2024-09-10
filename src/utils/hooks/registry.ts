import type { Database, Hinagi, Manager } from "../../structures";

export type HookType = Hinagi | Manager | Database;
export const HookRegistry = new Map<symbol, HookType>();

export const Symbols = {
    kClient: Symbol("Client"),
    kManager: Symbol("Manager"),
    kDatabase: Symbol("Database"),
} as const;

/**
 * This hook registry is from the music bot made by twlite
 * @copyright https://github.com/twlite/music-bot
 */
