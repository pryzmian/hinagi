import { AutoLoad, Command, Declare, Middlewares } from "seyfert";

@Declare({
    name: "remove",
    description: "Removes the specified option from the queue.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@AutoLoad()
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "queueIsEmpty"])
export default class RemoveCommand extends Command {}
