import { Container, decorate, injectable } from "inversify";
import { Client, Command, SubCommand } from "seyfert";
import { Hinagi } from "./structures/Client";
import { Database } from "./structures/modules/Database";

const container = new Container({ skipBaseClassChecks: true });

decorate(injectable(), Client);
decorate(injectable(), Command);
decorate(injectable(), SubCommand);

container.bind(Hinagi).toSelf().inSingletonScope();
container.bind(Database).toSelf().inSingletonScope();

export default container;
