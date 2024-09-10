import type { Manager } from "../../structures";
import { HookRegistry, Symbols } from "./registry";

/**
 * Returns the lavalink manager instance
 * This allows the lavalink manager instance to be used anywhere in the codebase.
 * @returns The lavalink manager instance.
 */
export function useManager(): Manager {
    const manager = HookRegistry.get(Symbols.kManager);
    if (!manager) throw new Error("Class Manager for Lavalink has not been initialized yet.");
    return manager as Manager;
}
