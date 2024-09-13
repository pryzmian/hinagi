import config from "config";
import type { CommandContext, OnOptionsReturnObject } from "seyfert";
import type { EmbedConfig } from "../../types";

export async function onOptionsError(context: CommandContext, metadata: OnOptionsReturnObject): Promise<void> {
    const { colors, emojis } = config.get<EmbedConfig>("embedConfig");
    const errorMessage = Object.entries(metadata)
        .filter((_) => _[1].failed)
        .map((error) => `\`${error[0]}\`: ${error[1].value}`)
        .join(", ");

    await context.editOrReply({
        embeds: [
            {
                color: colors.transparent,
                description: `${emojis.warning} ${errorMessage}`,
            },
        ],
    });
}
