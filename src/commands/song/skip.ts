import config from "config";
import { Command, type CommandContext, Declare, Options, createIntegerOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Utils } from "../../structures";
import { useManager } from "../../utils/hooks";
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
export default class SkipCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { options, client, member } = ctx;
        const { to } = options;

        const manager = useManager();
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        const player = manager.getPlayer(ctx.guildId!);
        const isAutoplayActive = !!player.get("enabledAutoplay");

        const voiceChannel = client.cache.voiceStates?.get(member?.id!, ctx.guildId!);
        const botChannel = client.cache.voiceStates?.get(client.botId!, ctx.guildId!);

        if (!voiceChannel)
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} You are not in a voice channel!`,
                    },
                ],
            });

        if (botChannel && botChannel.channelId !== voiceChannel.channelId)
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} You need to be in the same voice channel as me to use this command!`,
                    },
                ],
            });

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
