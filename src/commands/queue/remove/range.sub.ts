import config from "config";
import { type CommandContext, Declare, Options, SubCommand, createIntegerOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { EmbedConfig } from "#hinagi/types";

const options = {
    start: createIntegerOption({
        description: "The start index of the range.",
        required: true,
    }),
    end: createIntegerOption({
        description: "The end index of the range.",
        required: true,
    }),
};

@Declare({
    name: "range",
    description: "Remove a range of songs from the queue.",
})
@Options(options)
export default class RemoveRangeCommand extends SubCommand {
    public override async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { start, end } = options;

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);

        if (start >= end || end <= start) {
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} The start index cannot be greater/less than or equal to the end index!`,
                    },
                ],
            });
        }

        if (start > player.queue.tracks.length || end > player.queue.tracks.length) {
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} The start or end index cannot be greater than the length of the queue!`,
                    },
                ],
            });
        }

        await ctx.deferReply();

        const removedSongs = player.queue.tracks.splice(start - 1, end - start + 1);

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Removed a range of ${removedSongs.length} songs from the queue!`,
                },
            ],
        });
    }
}
