import config from "config";
import { Lavalink } from "#hinagi/structures";
import type { BotConfig, EmbedConfig } from "#hinagi/types";

export default new Lavalink({
    name: "reconnecting",
    type: "node",
    run: async (client, node) => {
        const { systemChannel } = config.get<BotConfig>("botConfig");
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        await client.messages.write(systemChannel, {
            embeds: [
                {
                    color: colors.warning,
                    title: "Node reconnecting",
                    description: `${emojis.warning} Node \`${node.id}\` is reconnecting...`,
                },
            ],
        });
    },
});
