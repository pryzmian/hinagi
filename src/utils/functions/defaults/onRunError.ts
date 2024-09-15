import config from "config";
import { AttachmentBuilder, type CommandContext, type MenuCommandContext } from "seyfert";
import type { BotConfig, EmbedConfig } from "#hinagi/types";

export async function onRunError(context: MenuCommandContext<any, never> | CommandContext, error: unknown): Promise<void> {
    const { client } = context;
    const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
    const { systemChannel } = config.get<BotConfig>("botConfig");

    const guild = context.guild();
    const executor = context.member;
    const command = context.command;

    const errorDetails = [
        `**Guild:** ${guild?.name} (${guild?.id})`,
        `**Executor:** ${executor?.username} (${executor?.id})`,
        `**Command:** ${command?.name}`,
        `**Error:** \n${error instanceof Error ? error.stack : String(error)}`,
    ].join("\n");

    const errorFileName = `${guild?.id}-${command?.name}-${new Date().toISOString()}.txt`;
    const errorFileBuffer = Buffer.from(errorDetails, "utf-8");
    const attachmentFile = new AttachmentBuilder({ filename: errorFileName }).setFile("buffer", errorFileBuffer);

    await client.messages
        .write(systemChannel, {
            files: [attachmentFile],
            embeds: [
                {
                    color: colors.transparent,
                    author: { name: `Executed by ${executor?.username}`, icon_url: executor?.avatarURL() },
                    title: "Error while running a command",
                    description: `${emojis.error} An error occurred while running the command \`${command?.name}\` in \`${guild?.name}\` (${guild?.id}).`,
                },
            ],
        })
        .catch(() => {});
}
