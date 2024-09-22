import type { CommandContext } from "seyfert";
import { Lavalink } from "#hinagi/structures";

export default new Lavalink({
    name: "trackEnd",
    type: "manager",
    run: async (client, player) => {
        if (!player.textChannelId) return;

        const ctx = player.get<CommandContext>("commandContext");
        const messageId = player.get<string | undefined>("messageId");
        if (!messageId) return;

        const me = ctx.me();
        if (!me) return;

        const permissions = await client.channels.memberPermissions(player.textChannelId, me);
        if (!permissions.has(["SendMessages", "ViewChannel"]))
            return client.logger.error("playerStart listener: Missing permissions to send messages or view channel.");

        await client.messages.delete(messageId, player.textChannelId);
    },
});
