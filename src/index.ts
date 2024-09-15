import "dotenv/config";

import { Logger } from "seyfert";
import { Hinagi } from "#hinagi/structures";

Logger.saveOnFile = "all";
Logger.dirname = "logs";

const client = new Hinagi();

(async () => await client.run())();
