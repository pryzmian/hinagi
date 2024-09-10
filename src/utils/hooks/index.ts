export { HookRegistry, Symbols } from "./registry";
import type { Database, Hinagi, Manager } from "../../structures";
import { HookRegistry, Symbols } from "./registry";

/**
 * Returns the client instance.
 * This allows the client instance to be used anywhere in the codebase.
 * @returns The client instance.
 */
export const useClient = (): Hinagi | null => (HookRegistry.get(Symbols.kClient) ?? null) as Hinagi | null;

/**
 * Returns the database instance.
 * This allows the database instance to be used anywhere in the codebase.
 * @returns The database instance.
 */
export const useDatabase = (): Database | null => (HookRegistry.get(Symbols.kDatabase) ?? null) as Database | null;


/**
 * Returns the lavalink manager instance
 * This allows the lavalink manager instance to be used anywhere in the codebase.
 * @returns The lavalink manager instance.
 */
export const useManager = (): Manager | null => (HookRegistry.get(Symbols.kManager) ?? null) as Manager | null;