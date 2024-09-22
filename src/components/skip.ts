import { ComponentCommand, type ComponentContext, Middlewares } from "seyfert";

@Middlewares(["inVoiceChannel", "sameVoiceChannel", "trackExists", "queueExists", "queueIsEmpty"])
export default class SkipButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "skip-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;
        const player = client.manager.getPlayer(guildId!);

        await ctx.interaction.deferUpdate();

        await player.skip(undefined, false);
    }
}
