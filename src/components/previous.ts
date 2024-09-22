import { ComponentCommand, type ComponentContext, Middlewares } from "seyfert";

@Middlewares(["inVoiceChannel", "sameVoiceChannel", "trackExists", "queueExists", "queueIsEmpty", "historyIsEmpty"])
export default class PreviousButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "previous-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;
        const player = client.manager.getPlayer(guildId!);

        await ctx.interaction.deferUpdate();

        await player.queue.add(await player.queue.shiftPrevious(), 0);
        await player.skip();
    }
}
