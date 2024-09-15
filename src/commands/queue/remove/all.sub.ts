import config from "config";
import { type CommandContext, Declare, SubCommand } from "seyfert";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "all",
    description: "Remove all songs from the queue.",
})
export default class RemoveAllCommand extends SubCommand {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);

        await ctx.deferReply();

        player.queue.tracks.length = 0;
        player.queue.previous.length = 0;

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} All songs have been removed from the queue.`,
                },
            ],
        });
    }
}
