import config from "config";
import { ActionRow, Button, type CommandContext } from "seyfert";
import { ButtonStyle } from "seyfert/lib/types";
import { Lavalink, Utils } from "#hinagi/structures";
import type { EmbedConfig } from "#hinagi/types";

export default new Lavalink({
    name: "trackStart",
    type: "manager",
    run: async (client, player, track) => {
        if (!player.textChannelId) return;
        if (!track) return;

        const ctx = player.get<CommandContext>("commandContext");
        const me = ctx.me();
        if (!me) return;

        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
        const permissions = await client.channels.memberPermissions(player.textChannelId, me);

        if (!permissions.has(["SendMessages", "ViewChannel"])) {
            client.logger.error("playerStart listener: Missing permissions to send messages or view channel.");
            return;
        }

        const row = new ActionRow<Button>().addComponents(
            new Button().setCustomId("previous-button").setEmoji(emojis.previous).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId("pause-button").setEmoji(emojis.pause).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId("skip-button").setEmoji(emojis.next).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId("stop-button").setEmoji(emojis.stop).setStyle(ButtonStyle.Danger),
            new Button().setCustomId("queue-button").setEmoji(emojis.queue).setStyle(ButtonStyle.Primary),
        );

        try {
            const message = await client.messages.write(player.textChannelId, {
                components: [row],
                embeds: [
                    {
                        color: colors.transparent,
                        title: "Now playing",
                        description: `${emojis.playing} ${Utils.toHyperLink(track)}\n**Duration:** ${track.info.isStream ? "`🔴 Live Stream`" : `\`${Utils.formatDuration(track.info.duration!)}\``}\n**Requested by:** ${track.requester}`,
                        thumbnail: { url: track.info.artworkUrl ?? "" },
                    },
                ],
            });

            if (message) player.set("messageId", message.id);
        } catch (error) {
            client.logger.error(`Failed to send now playing message: ${error}`);
        }
    },
});
