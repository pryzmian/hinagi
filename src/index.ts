import "dotenv/config";
import "reflect-metadata";
import "./inversify.config";

import { Logger } from "seyfert";

Logger.saveOnFile = "all";
Logger.dirname = "logs";