import type { ParseClient, ParseMiddlewares } from "seyfert";
import type { Middlewares } from "./middlewares";
import type { Hinagi } from "./structures/Client";

declare module "seyfert" {
    interface UsingClient extends ParseClient<Hinagi> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof Middlewares> {}
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            APPLICATION_ID: string;
            NODE_ENV: "development" | "production";
            DATABASE_URL: string;
            LAVALINK_HOST: string;
            LAVALINK_PORT: number;
            LAVALINK_AUTHORIZATION: string;
            LAVALINK_NODE_ID: string;
            LAVALINK_NODE_SECURE: boolean;
        }
    }
}
