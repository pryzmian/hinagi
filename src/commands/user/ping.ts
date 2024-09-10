import { Command, CommandContext, Declare } from "seyfert";

@Declare({
    name: "ping",
    description: "Ping the bot.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
export default class PingCommand extends Command {
    async run(ctx: CommandContext) {
        await ctx.editOrReply({ content: `Pong! Latency: ${ctx.client.gateway.latency}ms`});
    }
}