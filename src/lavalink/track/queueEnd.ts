import { Lavalink } from "#hinagi/structures";

export default new Lavalink({
    name: "queueEnd",
    type: "manager",
    run: async (client, player, _track, _payload) => {
        if (!player.textChannelId) return;

        const messageId = player.get<string | undefined>("messageId");
        if (!messageId) return;

        await client.messages.delete(messageId, player.textChannelId);
    },
});
