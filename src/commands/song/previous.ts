import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "previous",
    description: "Plays the previous song.",
    aliases: ["prev", "back"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "historyIsEmpty", "queueIsEmpty"])
export default class PreviousCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = ctx.client.manager.getPlayer(ctx.guildId!);

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

        await ctx.deferReply();

        const previousTrack = await player.queue.shiftPrevious();
        if (previousTrack) {
            await player.queue.add(previousTrack, 0);
            await player.skip();
        }

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Playing the previous song ${Utils.toHyperLink(previousTrack)}`,
                },
            ],
        });
    }
}
