import "dotenv/config";
import "reflect-metadata";

import container from "./container";

import { Logger } from "seyfert";
import { Hinagi } from "./structures";

Logger.saveOnFile = "all";
Logger.dirname = "logs";

const client = container.get(Hinagi);

(async () => await client.run())();
