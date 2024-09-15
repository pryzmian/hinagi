import config from "config";
import type { RepeatMode } from "lavalink-client";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "repeat",
    description: "Change the repeat mode of the current queue.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})

@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueIsEmpty", "queueExists"])
export default class RepeatCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;

        const repeatType: Record<RepeatMode, string> = {
            off: "off",
            queue: "queue",
            track: "current track",
        };

        const player = client.manager.getPlayer(ctx.guildId!);
        const currentRepeatMode = player.repeatMode;

        const nextRepeatMode = currentRepeatMode === "off" ? "queue" : currentRepeatMode === "queue" ? "track" : "off";

        await player.setRepeatMode(nextRepeatMode);

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Repeat mode set to \`${repeatType[nextRepeatMode]}\`!`,
                },
            ],
        });
    }
}
