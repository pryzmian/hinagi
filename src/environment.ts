import type { ParseClient, ParseMiddlewares } from "seyfert";
import type { hinagiMiddlewares } from "#hinagi/middlewares";
import type { Hinagi } from "#hinagi/structures";

declare module "seyfert" {
    interface UsingClient extends ParseClient<Hinagi> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof hinagiMiddlewares> {}
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            APPLICATION_ID: string;
            LAVALINK_HOST: string;
            LAVALINK_PORT: number;
            LAVALINK_AUTHORIZATION: string;
            LAVALINK_NODE_ID: string;
        }
    }
}
