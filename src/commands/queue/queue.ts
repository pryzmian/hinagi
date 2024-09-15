import config from "config";
import { Command, type CommandContext, Declare, Embed, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { EmbedPaginator, Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "queue",
    description: "Show the current queue of songs.",
    aliases: ["q"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "queueExists"])
export default class QueueCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);
        const tracksPerPage = 10;
        const tracks = player.queue.tracks.map(
            (track, index) =>
                `**${index + 1}.** \`${Utils.formatDuration(track.info.duration!)}\` | ${Utils.toHyperLink(track)} (${track.requester})`,
        );
        const current = player.queue.current;
        const paginator = new EmbedPaginator(ctx);

        const nowPlayingDescription = `${emojis.playing} **Now Playing:**\n${Utils.toHyperLink(current!)}\n${Utils.createProgressBar(player)}\n\n${emojis.upnext} **Up Next:**\n`;

        if (!tracks.length) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.success,
                        description: `${emojis.error} ${nowPlayingDescription}No tracks in queue. Add some tracks with the \`play\` command.`,
                    },
                ],
            });
        }

        if (tracks.length < tracksPerPage) {
            await ctx.write({
                embeds: [
                    {
                        color: colors.transparent,
                        thumbnail: { url: current?.info.artworkUrl ?? "" },
                        description: nowPlayingDescription + tracks.join("\n"),
                        footer: {
                            text: `Total tracks: ${tracks.length} | Estimated total time: ${Utils.formatDuration(player.queue.utils.totalDuration())}`,
                        },
                    },
                ],
            });
        } else {
            for (let i = 0; i < tracks.length; i += tracksPerPage) {
                paginator.addEmbed(
                    new Embed()
                        .setColor(colors.transparent)
                        .setThumbnail(current?.info.artworkUrl ?? "")
                        .setDescription(nowPlayingDescription + tracks.slice(i, i + tracksPerPage).join("\n"))
                        .setFooter({
                            text: `Total tracks: ${tracks.length} | Estimated total time: ${Utils.formatDuration(player.queue.utils.totalDuration())}`,
                        }),
                );
            }

            await paginator.reply();
        }
    }
}
