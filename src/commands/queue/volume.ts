import config from "config";
import { Command, type CommandContext, Declare, Middlewares, Options, createIntegerOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { EmbedConfig } from "#hinagi/types";

const options = {
    volume: createIntegerOption({
        description: "The volume to set the player to.",
        required: true,
        min_value: 1,
        max_value: 100,
    }),
};

@Declare({
    name: "volume",
    description: "Change the volume of the current song.",
    aliases: ["vol", "v"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["inVoiceChannel", "sameVoiceChannel", "queueExists", "queueIsEmpty"])
export default class VolumeCommand extends Command {
    public override async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { volume } = options;

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const player = client.manager.getPlayer(ctx.guildId!);

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

        let message = `${emojis.success} The volume has been set to \`${volume}%\``;

        if (volume === 1) {
            await player.setVolume(volume);
            await player.pause();
            message += " and the player has been paused.";
        } else if (volume > 1 && player.paused) {
            await player.resume();
            await player.setVolume(volume);
            message += " and the player has been resumed.";
        }

        await player.setVolume(volume);
        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: message,
                },
            ],
        });
    }
}
