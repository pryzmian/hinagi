import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Utils } from "../../structures";
import type { EmbedConfig } from "../../utils/types";

@Declare({
    name: "nowplaying",
    description: "Show the currently playing song.",
    aliases: ["np"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel"])
export default class NowPlayingCommand extends Command {
    async run(ctx: CommandContext) {
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        const player = ctx.client.manager.getPlayer(ctx.guildId!);
        if (!player)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.error,
                        description: `${emojis.error} There is no music playing!`,
                    },
                ],
            });

        const currentSong = player.queue.current;

        await ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `**Now Playing**\n${emojis.playing} ${Utils.toString(currentSong)}\n${Utils.createProgressBar(player)}`,
                },
            ],
        });
    }
}
