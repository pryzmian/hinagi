import config from "config";
import { Command, type CommandContext, Declare, Middlewares, type VoiceChannel } from "seyfert";
import type { BotConfig, EmbedConfig } from "#hinagi/types";

@Declare({
    name: "leave",
    description: "Leaves the voice channel.",
    aliases: ["disconnect", "dc"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "sameVoiceChannel"])
export default class LeaveCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client } = ctx;
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const { goodByeImage } = config.get<BotConfig>("botConfig");

        const player = client.manager.getPlayer(ctx.guildId!);
        const botChannel = (await client.cache.voiceStates?.get(client.botId!, ctx.guildId!)?.channel()) as VoiceChannel;

        if (!botChannel) {
            return ctx.editOrReply({
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} I'm not in a voice channel!`,
                    },
                ],
            });
        }

        await player.destroy();
        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    title: `${emojis.success} Disconnected!`,
                    description: `Disconnected from the voice channel, hope to see you back soon! ${emojis.waving}`,
                    image: { url: goodByeImage },
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }
}
