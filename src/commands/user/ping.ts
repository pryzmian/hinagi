import config from "config";
import { Command, type CommandContext, Declare } from "seyfert";
import type { EmbedConfig } from "#hinagi/types";
@Declare({
    name: "ping",
    description: "Ping the bot.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
export default class PingCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;
        const { colors } = config.get<EmbedConfig>("embedConfig");
        await ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `Pong! 🏓 \`${Math.floor(client.gateway.latency)}ms\``,
                },
            ],
        });
    }
}
