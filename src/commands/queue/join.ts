import config from "config";
import { Command, type CommandContext, Declare, Middlewares, type VoiceChannel } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { DestroyReason, type EmbedConfig } from "#hinagi/types";

@Declare({
    name: "join",
    description: "Joins the voice channel.",
    aliases: ["summon", "connect"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel"])
export default class JoinCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client, member } = ctx;
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        const memberVoiceChannel = client.cache.voiceStates?.get(member?.id!, ctx.guildId!);
        const botVoiceChannel = client.cache.voiceStates?.get(client.botId!, ctx.guildId!);
        const isVoiceChannel = (await memberVoiceChannel?.channel())?.isVoice();

        if (!isVoiceChannel) {
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} You need to be **in a voice channel** to perform this action!`,
                    },
                ],
            });
        }

        // Join the voice channel even if it's already connected to one
        if (botVoiceChannel) {
            const channel = (await botVoiceChannel.channel()) as VoiceChannel;
            const members = await Promise.all((await channel.states()).map((state) => state.member()));
            const isEmpty = members.filter((member) => !member.user.bot).length === 0;

            const isAlreadyConnected = memberVoiceChannel!.channelId === botVoiceChannel.channelId;
            const isNotSameChannel = memberVoiceChannel!.channelId !== botVoiceChannel.channelId;

            if (!isEmpty && (isAlreadyConnected || isNotSameChannel)) {
                return ctx.editOrReply({
                    flags: MessageFlags.Ephemeral,
                    embeds: [
                        {
                            color: colors.transparent,
                            description: `${emojis.error} I'm already connected to a voice channel! (<#${botVoiceChannel.channelId}>)`,
                        },
                    ],
                });
            }
        }

        await ctx.deferReply();

        const player = client.manager.getPlayer(ctx.guildId!);
        if (player) await player.destroy(DestroyReason.ChangedChannel);

        const newPlayer = client.manager.createPlayer({
            guildId: ctx.guildId!,
            voiceChannelId: memberVoiceChannel?.channelId!,
            textChannelId: ctx.channelId!,
            selfDeaf: true,
            volume: 100,
        });

        await newPlayer.connect();

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Summoned to <#${memberVoiceChannel?.channelId}>!`,
                },
            ],
        });
    }
}
