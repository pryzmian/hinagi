import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "replay",
    description: "Replays the current song.",
    aliases: ["rp", "again"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "queueIsEmpty"])
export default class ReplayCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = ctx.client.manager.getPlayer(ctx.guildId!);

        if (!player.queue.current) {
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

        if (!player.playing) {
            return ctx.editOrReply({
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

        await player.seek(0);
        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Restarted track ${Utils.toHyperLink(player.queue.current)}. Enjoy listening again!`,
                },
            ],
        });
    }
}
