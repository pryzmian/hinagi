import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "nowplaying",
    description: "Show the currently playing song.",
    aliases: ["np", "current", "now"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists"])
export default class NowPlayingCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        const player = ctx.client.manager.getPlayer(ctx.guildId!);
        const currentSong = player.queue.current;

        if (!currentSong) {
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} There is no song currently playing!`,
                    },
                ],
            });
        }

        await ctx.deferReply();

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `**Now Playing**\n${emojis.playing} ${Utils.toString(currentSong!)}\n${Utils.createProgressBar(player)}`,
                },
            ],
        });
    }
}
