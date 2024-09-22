import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "pause",
    description: "Toggles the pause state of the current song.",
    aliases: ["wait"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "queueIsEmpty"])
export default class PauseCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);

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

        await ctx.deferReply();

        if (player.paused) {
            await player.resume();
            return ctx.editOrReply({
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.success} Resumed the current song!`,
                    },
                ],
            });
        }

        await player.pause();
        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Paused the current song!`,
                },
            ],
        });
    }
}
