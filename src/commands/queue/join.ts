import config from "config";
import { Command, type CommandContext, Declare, Middlewares, type VoiceChannel } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { EmbedConfig } from "#hinagi/types";

@Declare({
    name: "join",
    description: "Joins the voice channel.",
    aliases: ["summon", "connect"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["inVoiceChannel", "hasPermissions"])
export default class JoinCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client, member, guildId } = ctx;
        const { cache, manager, botId } = client;
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        // Fetch both member and bot voice states in parallel to avoid unnecessary awaiting
        const [botMember, memberVoiceState, botVoiceState] = await Promise.all([
            ctx.me() ?? client.members.fetch(guildId!, botId),
            cache.voiceStates?.get(member?.id!, guildId!)?.channel(),
            cache.voiceStates?.get(botId, guildId!)?.channel(),
        ]);

        const memberVoiceChannel = memberVoiceState as VoiceChannel;
        const botVoiceChannel = botVoiceState as VoiceChannel;

        // Early return if already in the same voice channel
        if (botVoiceChannel?.id === memberVoiceChannel?.id) {
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} I'm already connected to your voice channel! (<#${botVoiceChannel?.id}>)`,
                    },
                ],
            });
        }

        // Check if botVoiceChannel is occupied by non-bots
        if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id) {
            const channelStates = await botVoiceChannel.states();
            const members = await Promise.all(channelStates.map((x) => x.member()));
            const isEmpty = members.filter((x) => !x.user.bot).length === 0;

            if (!isEmpty) {
                return ctx.editOrReply({
                    flags: MessageFlags.Ephemeral,
                    embeds: [
                        {
                            color: colors.transparent,
                            description: `${emojis.error} I'm already connected to a different voice channel! (<#${botVoiceChannel.id}>)`,
                        },
                    ],
                });
            }
        }

        // Handle player creation or switching voice channels
        const player = manager.getPlayer(guildId!);
        if (player) {
            await player.changeVoiceState({
                voiceChannelId: memberVoiceChannel.id!,
                selfDeaf: true,
            });
        } else {
            await manager
                .createPlayer({
                    guildId: guildId!,
                    voiceChannelId: memberVoiceChannel.id!,
                    textChannelId: ctx.channelId!,
                    selfDeaf: true,
                    volume: 100,
                })
                .connect();
        }

        // Handle stage channel scenario
        const botVoice = await botMember.voice();
        if (memberVoiceChannel.isStage()) {
            // Doing this because discord bugs if the bot joins to quickly or sum and does not play audio 🗿
            setTimeout(async () => {
                await botVoice.setSuppress(false).catch(() => {});
            }, 1000);
        } else {
            botVoice.setChannel(memberVoiceChannel.id!).catch(() => {});
        }

        // Send success message

        return ctx.editOrReply({
            embeds: [
                {
                    color: colors.transparent,
                    description: `${emojis.success} Summoned to <#${memberVoiceChannel.id}>!`,
                },
            ],
        });
    }
}
