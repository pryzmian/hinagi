import config from "config";
import { inject } from "inversify";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { Manager, Utils } from "../../structures";
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
    @inject(Manager) private manager!: Manager;

    async run(ctx: CommandContext) {
        if (!this.manager) return;

        // haz esto mismo donde uses el manager
        const player = this.manager.getPlayer(ctx.guildId!);

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const currentSong = player.queue.current;

        await ctx.deferReply();

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
