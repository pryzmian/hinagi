import config from "config";
import { Command, type CommandContext, Declare, Embed, Middlewares } from "seyfert";
import { EmbedPaginator, Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "history",
    description: "Shows the history of songs that have been played.",
    aliases: ["h"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "historyIsEmpty", "historyIsEmpty"])
export default class HistoryCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;

        const { colors } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);

        await ctx.deferReply();

        const tracksPerPage = 10;
        const tracks = player.queue.previous.map(
            (track, index) =>
                `**${index + 1}.** \`${Utils.formatDuration(track.info.duration!)}\` | ${Utils.toHyperLink(track)} (${track.requester})`,
        );
        const paginator = new EmbedPaginator(ctx);

        if (tracks.length < tracksPerPage) {
            await ctx.editOrReply({
                embeds: [
                    {
                        color: colors.transparent,
                        description: tracks.join("\n"),
                        footer: { text: `Total tracks: ${tracks.length}` },
                    },
                ],
            });
        } else {
            for (let i = 0; i < tracks.length; i += tracksPerPage) {
                paginator.addEmbed(
                    new Embed()
                        .setColor(colors.transparent)
                        .setDescription(tracks.slice(i, i + tracksPerPage).join("\n"))
                        .setFooter({ text: `Total tracks: ${tracks.length}` }),
                );
            }

            await paginator.reply();
        }
    }
}
