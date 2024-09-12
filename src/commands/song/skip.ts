import config from "config";
import { inject } from "inversify";
import { Command, type CommandContext, Declare, Middlewares, Options, createIntegerOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Manager, Utils } from "../../structures";
import type { EmbedConfig } from "../../utils/types";

const options = {
    to: createIntegerOption({
        description: "The position of the song you want to skip to.",
        required: false,
    }),
};

@Declare({
    name: "skip",
    description: "Skip the current song or to a specific song in the queue.",
    aliases: ["s"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["inVoiceChannel", "sameVoiceChannel"])
export default class SkipCommand extends Command {
    @inject(Manager) private manager!: Manager;
    async run(ctx: CommandContext<typeof options>) {
        if (!this.manager) return;

        const { options } = ctx;
        const { to } = options;

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = this.manager.getPlayer(ctx.guildId!);

        if (to && to > player.queue.tracks.length)
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} The song at position ${to} does not exist!`,
                    },
                ],
            });

        await ctx.deferReply();

        const targetTrack = to ? player.queue.tracks[to - 1] : player.queue.current;
        const toSelection = to ? `to *${Utils.toHyperLink(targetTrack)}*` : `*${Utils.toHyperLink(targetTrack)}*`;

        await player.skip(to, false);
        await ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Skipped ${toSelection}`,
                },
            ],
        });
    }
}
