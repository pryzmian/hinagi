import "dotenv/config";

import { Logger } from "seyfert";
import { Database, Hinagi, Manager } from "./structures";

Logger.saveOnFile = "all";
Logger.dirname = "logs";

new Hinagi();
new Database();
new Manager();
