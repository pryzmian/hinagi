import config from "config";
import type { AnyContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { EmbedConfig } from "#hinagi/types";

export async function onMiddlewaresError(context: AnyContext, error: string): Promise<void> {
    const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
    await context.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [
            {
                color: colors.transparent,
                description: `${emojis.error} ${error}`,
            },
        ],
    });
}
