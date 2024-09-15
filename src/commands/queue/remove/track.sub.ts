import config from "config";
import { type CommandContext, Declare, Options, SubCommand, createIntegerOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

const options = {
    track: createIntegerOption({
        name: "track",
        description: "The index of the song to remove from the queue.",
        required: true,
    }),
};

@Declare({
    name: "song",
    description: "Remove a song from the queue.",
})
@Options(options)
export default class RemoveTrackCommand extends SubCommand {
    public override async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { track } = options;

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);

        const trackToRemove = player.queue.tracks[track - 1];

        if (!trackToRemove) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} The track at index \`${track}\` does not exist!`,
                    },
                ],
            });
        }

        const removedTrack = await player.queue.remove(trackToRemove);
        client.logger.info(removedTrack);

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Removed the track ${Utils.toHyperLink(trackToRemove)}`,
                },
            ],
        });
    }
}
