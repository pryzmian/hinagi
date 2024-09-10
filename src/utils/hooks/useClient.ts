import type { Hinagi } from "../../structures";
import { HookRegistry, Symbols } from "./registry";

/**
 * Returns the client instance.
 * This allows the client instance to be used anywhere in the codebase.
 * @returns The client instance.
 */
export function useClient(): Hinagi {
    const client = HookRegistry.get(Symbols.kClient);
    if (!client) throw new Error("Class Hinagi has not been initialized yet.");
    return client as Hinagi;
}
