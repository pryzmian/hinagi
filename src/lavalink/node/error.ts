import config from "config";
import { AttachmentBuilder } from "seyfert";
import { Lavalink } from "#hinagi/structures";
import type { BotConfig, EmbedConfig } from "#hinagi/types";

export default new Lavalink({
    name: "error",
    type: "node",
    run: async (client, node, error) => {
        const { systemChannel } = config.get<BotConfig>("botConfig");
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        const errorDetails = [
            `Node: ${node.id}`,
            `Error name: ${error.name}`,
            `Error message: ${error.message}`,
            `Error cause: ${error.cause}`,
            `Stack error: \n${error.stack}`,
        ].join("\n");

        const errorFileName = `\`${node.id}\`-${new Date().toISOString()}.txt`;
        const errorFileBuffer = Buffer.from(errorDetails, "utf-8");
        const attachmentFile = new AttachmentBuilder({ filename: errorFileName }).setFile("buffer", errorFileBuffer);

        await client.messages.write(systemChannel, {
            files: [attachmentFile],
            embeds: [
                {
                    color: colors.error,
                    title: "Node error",
                    description: `${emojis.error} An error ocurred at node \`${node.id}\`.`,
                },
            ],
        });
    },
});
