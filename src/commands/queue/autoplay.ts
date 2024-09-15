import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "autoplay",
    description: "Toggles the autoplay feature.",
    aliases: ["ap"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "queueIsEmpty"])
export default class AutoplayCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = ctx.client.manager.getPlayer(ctx.guildId!);
        const autoplay = !!player.get("enabledAutoplay");

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

        player.set("enabledAutoplay", !autoplay);

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Autoplay is now ${autoplay ? "disabled" : "enabled"}.`,
                },
            ],
        });
    }
}
