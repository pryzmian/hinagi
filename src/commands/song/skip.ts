import config from "config";
import { Command, type CommandContext, Declare, Middlewares, Options, createIntegerOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

const options = {
    to: createIntegerOption({
        description: "The position of the song you want to skip to.",
        required: false,
    }),
};

@Declare({
    name: "skip",
    description: "Skip the current song or to a specific song in the queue.",
    aliases: ["s"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "queueIsEmpty"])
export default class SkipCommand extends Command {
    public override async run(ctx: CommandContext<typeof options>) {
        const { options, client } = ctx;
        const { to } = options;

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);

        if (!player.queue.current) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} There is no song currently playing!`,
                    },
                ],
            });
        }

        if (!player.playing) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} There is no song currently playing, try resuming or adding a song to the queue first!`,
                    },
                ],
            });
        }

        if (to && to > player.queue.tracks.length) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} The song at position ${to} does not exist!`,
                    },
                ],
            });
        }

        await ctx.deferReply();

        try {
            const targetTrack = to ? player.queue.tracks[to - 1] : player.queue.current;
            const toSelection = to ? `to *${Utils.toHyperLink(targetTrack!)}*` : `*${Utils.toHyperLink(targetTrack!)}*`;

            await player.skip(to, false);

            return ctx.editOrReply({
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.success} Skipped ${toSelection}`,
                    },
                ],
            });
        } catch (error) {
            throw new Error(error as string);
        }
    }
}
