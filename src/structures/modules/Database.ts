import { PrismaClient } from "@prisma/client";
import { HookRegistry, Symbols, useClient } from "../../utils/hooks";

export class Database extends PrismaClient {
    /**
     * Discord client instance.
     */
    private client = useClient()!;

    /**
     * Database connection status.
     */
    private connected: boolean = false;

    public constructor() {
        super();
        this.connect();
    }

    /**
     * Connects to the database.
     * @returns A promise that resolves when the database is connected.
     */
    public async connect(): Promise<void> {
        await this.$connect().then(() => {
            this.connected = true;
            HookRegistry.set(Symbols.kDatabase, this);
            this.client.logger.info("Database has been initialized.");
        });
    }

    /**
     * Checks if the database is connected.
     * @returns A boolean indicating if the database is connected.
     */
    public isConnected(): boolean {
        return this.connected;
    }
}
