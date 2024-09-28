import config from "config";
import type { UsingClient, VoiceState } from "seyfert";
import { DestroyReason, type EmbedConfig, type PlayerConfig } from "#hinagi/types";

const timeouts = new Map<string, NodeJS.Timeout>();

export async function emptyChannel(client: UsingClient, newState: VoiceState, _oldState?: VoiceState): Promise<void> {
    const player = client.manager.getPlayer(newState.guildId);
    if (!player) return;
    if (!(player.textChannelId && player.voiceChannelId)) return;

    const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
    const { emptyChannelTimeout } = config.get<PlayerConfig>("playerConfig");

    const stateChannel = await client.channels.fetch(player.voiceChannelId!);
    if (!stateChannel.is(["GuildVoice", "GuildStageVoice"])) return;

    const members = await Promise.all((await stateChannel.states()).map((x) => x.member()));
    const isEmpty = members.filter((x) => !x.user.bot).length === 0;

    if (
        isEmpty &&
        (player.playing || player.paused || player.queue.tracks.length + Number(!!player.queue.current) === 0) &&
        player.connected
    ) {
        client.logger.debug("Voice channel is empty, setting a timeout to destroy the player...");

        await player.pause().catch(() => null);

        const timeoutId = setTimeout(async () => {
            await player.destroy(DestroyReason.ChannelEmpty);
            timeouts.delete(player.guildId);

            await client.messages.write(player.textChannelId!, {
                embeds: [
                    {
                        color: colors.transparent,
                        title: "Left the voice channel",
                        description: `${emojis.voice} The player has been destroyed due to inactivity.`,
                    },
                ],
            });

            client.logger.debug("Player has been destroyed due to inactivity.");
        }, emptyChannelTimeout);

        timeouts.set(player.guildId, timeoutId);
    }

    if (!isEmpty && timeouts.has(player.guildId)) {
        if (player.paused) await player.resume();

        clearTimeout(timeouts.get(player.guildId)!);
        timeouts.delete(player.guildId);

        client.logger.debug("Voice channel is not empty, resuming the player...");
    }
}
