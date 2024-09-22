import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "previous",
    description: "Plays the previous song.",
    aliases: ["prev", "back"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "historyIsEmpty"])
export default class PreviousCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = ctx.client.manager.getPlayer(ctx.guildId!);

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
