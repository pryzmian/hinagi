import config from "config";
import { Command, type CommandContext, Declare, Middlewares } from "seyfert";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "shuffle",
    description: "Shuffle the current queue of songs.",
    aliases: ["sh"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueIsEmpty", "queueExists"])
export default class ShuffleCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;
        const player = client.manager.getPlayer(ctx.guildId!);

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        await ctx.deferReply();
        await player.queue.shuffle();

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} The queue has been shuffled!`,
                },
            ],
        });
    }
}
