import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import type { Hinagi } from "../Client";

@injectable()
export class Database extends PrismaClient {
    /**
     * Database connection status.
     */
    private connected: boolean = false;

    public constructor(private readonly client: Hinagi) {
        super();
        this.client = client;
        this.connect();
    }

    /**
     * Connects to the database.
     * @returns A promise that resolves when the database is connected.
     */
    public async connect(): Promise<void> {
        await this.$connect().then(() => {
            this.connected = true;
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
