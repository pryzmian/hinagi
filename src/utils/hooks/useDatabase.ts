import type { Database } from "../../structures";
import { HookRegistry, Symbols } from "./registry";

/**
 * Returns the database instance.
 * This allows the database instance to be used anywhere in the codebase.
 * @returns The database instance.
 */
export function useDatabase(): Database {
    const database = HookRegistry.get(Symbols.kDatabase);
    if (!database) throw new Error("ClassDatabase has not been initialized yet.");
    return database as Database;
}
