import config from "config";
import { Command, type CommandContext, Declare } from "seyfert";
import { Utils } from "../../structures";
import { useManager } from "../../utils/hooks";
import type { EmbedConfig } from "../../utils/types";

@Declare({
    name: "nowplaying",
    description: "Show the currently playing song.",
    aliases: ["np"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
export default class NowPlayingCommand extends Command {
    async run(ctx: CommandContext) {
        const manager = useManager();
        if (!manager) return;
        
        const player = manager.getPlayer(ctx.guildId!);

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const currentSong = player.queue.current;

        await ctx.deferReply();

        if (!currentSong) {
            return ctx.editOrReply({
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} There is no song currently playing!`,
                    },
                ],
            });
        }

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
