import config from "config";
import { Command, type CommandContext, Declare } from "seyfert";
import { Utils } from "#hinagi/structures";
import type { BotConfig, EmbedConfig } from "#hinagi/types";

@Declare({
    name: "about",
    description: "Get information about the bot.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
export default class AboutCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;
        const { colors } = config.get<EmbedConfig>("embedConfig");
        const { sourceCode, supportServer, inviteLink } = config.get<BotConfig>("botConfig");

        await ctx.deferReply();

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.info,
                    title: "About Hinagi",
                    description: "Hinagi is a music bot that is designed to be easy to use and reliable.",
                    fields: [
                        {
                            name: "General Information",
                            value: `**・Active Players:** ${client.manager.players.size ?? 0}\n**・Total Guilds:** ${client.cache.guilds?.count() ?? 0}\n**・Total Users:** ${client.cache.users?.count() ?? 0}`,
                        },
                        {
                            name: "System Information",
                            value: `**・Memory Usage:** ${Utils.formatMemoryUsage(process.memoryUsage().rss)}\n**・CPU Usage:** ${Utils.formatCPUUsage().toFixed(2)}%\n**・System Uptime:** ${Utils.formatTime(process.uptime())}\n**・Latency:** ${Math.floor(client.gateway.latency)}ms`,
                        },
                        {
                            name: "Links",
                            value: `**・[Source Code](${sourceCode})**\n**・[Support Server](${supportServer})**\n**・[Invite Link](${inviteLink})**`,
                        },
                    ],
                },
            ],
        });
    }
}
