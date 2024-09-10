import type { ParseClient, ParseMiddlewares } from "seyfert";
import type { Middlewares } from "./middlewares";
import type { Hinagi } from "./structures/Client";

declare module "seyfert" {
    interface UsingClient extends ParseClient<Hinagi> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof Middlewares> {}
}
