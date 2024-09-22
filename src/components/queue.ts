import config from "config";
import { ComponentCommand, type ComponentContext, Embed, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { EmbedPaginator, Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

@Middlewares(["inVoiceChannel", "sameVoiceChannel", "trackExists", "queueExists", "queueIsEmpty"])
export default class QueueButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "queue-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
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

        const nowPlayingDescription = `${emojis.playing} **Now playing:**\n${Utils.toHyperLink(current!) ?? "Nothing playing right now..."}\n${Utils.createProgressBar(player)}\n\n${emojis.upnext} **Up Next:**\n`;

        if (!tracks.length) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${nowPlayingDescription}No tracks in queue. Add some tracks with the \`play\` command.`,
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

            await paginator.reply(true);
        }
    }
}
