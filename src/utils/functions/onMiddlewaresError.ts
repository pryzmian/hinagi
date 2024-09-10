import config from "config";
import type { CommandContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { EmbedConfig } from "../types";

export async function handleMiddlewaresError(context: CommandContext, error: Error) {
    const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
    await context.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [
            {
                color: colors.transparent,
                description: `${emojis.error} ${error.message}`,
            },
        ],
    });
}
