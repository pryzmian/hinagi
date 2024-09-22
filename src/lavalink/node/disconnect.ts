import config from "config";
import { Lavalink } from "#hinagi/structures";
import type { BotConfig, EmbedConfig } from "#hinagi/types";

export default new Lavalink({
    name: "disconnect",
    type: "node",
    run: async (client, node) => {
        const { systemChannel } = config.get<BotConfig>("botConfig");
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        await client.messages.write(systemChannel, {
            embeds: [
                {
                    color: colors.error,
                    title: "Node disconnected",
                    description: `${emojis.error} Node \`${node.id}\` has been disconnected!`,
                },
            ],
        });
    },
});
