import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "stop",
    description: "Stops and clears the queue.",
    aliases: ["end"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists"])
export default class StopCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = ctx.client.manager.getPlayer(ctx.guildId!);

        await ctx.deferReply();

        await player.destroy();

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} The queue has been cleared and the bot has left the voice channel.`,
                },
            ],
        });
    }
}
