import { Container, decorate, injectable } from "inversify";
import { Client, Command, SubCommand } from "seyfert";
import { Hinagi } from "./structures/Client";
import { Database } from "./structures/modules/Database";
import { Manager } from "./structures/modules/Player";

const container = new Container({ skipBaseClassChecks: true });

decorate(injectable(), Client);
decorate(injectable(), Command);
decorate(injectable(), SubCommand);

container.bind(Hinagi).toSelf().inSingletonScope();
container.get<Hinagi>(Hinagi);

container.bind(Database).toSelf().inSingletonScope();
container.bind(Manager).toSelf().inSingletonScope();

export default container;
