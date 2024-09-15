import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

(async () => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.info("Deleting files...");

    try {
        const path = resolve("dist");
        if (existsSync(path)) await rm(path, { recursive: true });
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.info("Done! Cleared.");
    } catch (error) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.info(error);
        process.exit(1);
    }
})();
