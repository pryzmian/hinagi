import { ComponentCommand, type ComponentContext, Middlewares } from "seyfert";

@Middlewares(["inVoiceChannel", "sameVoiceChannel", "trackExists", "queueExists", "queueIsEmpty"])
export default class StopButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "stop-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;
        const player = client.manager.getPlayer(guildId!);

        await ctx.interaction.deferUpdate();

        const playingMessage = player.get<string>("messageId");
        if (playingMessage) await client.messages.delete(playingMessage, player.textChannelId!);

        await player.destroy();
    }
}
