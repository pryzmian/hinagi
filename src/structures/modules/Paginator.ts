import config from "config";
import { ActionRow, type AnyContext, Button, type Embed, type Message, type WebhookMessage } from "seyfert";
import type { InteractionCreateBodyRequest, InteractionMessageUpdateBodyRequest } from "seyfert/lib/common/index.js";
import { type APIButtonComponentWithCustomId, ButtonStyle, ComponentType, MessageFlags } from "seyfert/lib/types/index.js";
import type { EmbedConfig } from "#hinagi/types";

const { colors } = config.get<EmbedConfig>("embedConfig");

export class EmbedPaginator {
    private pages: Record<string, number> = {};
    private embeds: Embed[] = [];

    private ctx: AnyContext;
    private message: Message | WebhookMessage | null;

    constructor(ctx: AnyContext) {
        this.ctx = ctx;
        this.message = null;
    }

    private getRow(userId: string): ActionRow<Button> {
        const { pages, embeds } = this;

        const row = new ActionRow<Button>().addComponents(
            new Button()
                .setLabel("Previous")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("pagination-pagePrev")
                .setDisabled(pages[userId] === 0),
            new Button()
                .setLabel(`${this.currentPage}/${this.maxPages}`)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
                .setCustomId("pagination-pagePos"),
            new Button()
                .setLabel("Next")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("pagination-pageNext")
                .setDisabled(pages[userId] === embeds.length - 1),
        );

        return row;
    }

    private async createCollector() {
        const { ctx, pages, embeds, message } = this;
        const { client } = ctx;

        if (!message) return;

        const userId = ctx.author.id;
        const collector = message.createComponentCollector({
            idle: 60000,
            filter: async (interaction) => {
                if (interaction.user.id !== ctx.author.id) {
                    await interaction.write({
                        flags: MessageFlags.Ephemeral,
                        embeds: [
                            {
                                description: `Only the user: ${ctx.author.toString()} can use this.`,
                                color: colors.error,
                            },
                        ],
                    });

                    return false;
                }

                return true;
            },
            onStop: async (reason) => {
                if (reason === "idle") {
                    if (!message) return;

                    const row = new ActionRow<Button>().setComponents(
                        message.components[0].components
                            .map((builder) => builder.toJSON())
                            .filter((row) => row.type === ComponentType.Button)
                            .map((component) => {
                                return new Button(component as APIButtonComponentWithCustomId).setDisabled(true);
                            }),
                    );

                    await client.messages.edit(message.id, message.channelId, { components: [row] }).catch(() => null);
                }
            },
        });

        collector.run(["pagination-pagePrev", "pagination-pageNext"], async (interaction) => {
            if (!interaction.isButton()) return;

            if (interaction.customId === "pagination-pagePrev" && pages[userId] > 0) --pages[userId];
            if (interaction.customId === "pagination-pageNext" && pages[userId] < embeds.length - 1) ++pages[userId];

            await interaction.deferUpdate();
            await ctx.editOrReply({ embeds: [embeds[pages[userId]]], components: [this.getRow(userId)] }).catch(() => null);
        });
    }

    get currentPage(): number {
        return this.pages[this.ctx.author.id] + 1;
    }

    get maxPages(): number {
        return this.embeds.length;
    }

    public addEmbed(embed: Embed): this {
        this.embeds.push(embed);
        return this;
    }

    public setPage(page: number): this {
        const { message, embeds, pages, ctx } = this;

        if (!embeds.length) throw new Error("I can't send the pagination without embeds.");
        if (!message) throw new Error("I can't set the page to an unresponded pagination.");

        if (page > embeds.length) throw new Error(`The page "${page}" exceeds the limit of "${embeds.length}" pages.`);

        const userId = ctx.author.id;

        pages[userId] = page - 1;

        ctx.editOrReply({
            content: "",
            embeds: [embeds[pages[userId]]],
            components: [this.getRow(userId)],
        });

        return this;
    }

    public async reply(ephemeral?: boolean): Promise<this> {
        const { ctx, pages, embeds } = this;

        const flags = ephemeral ? MessageFlags.Ephemeral : undefined;
        const userId = ctx.author.id;

        pages[userId] = pages[userId] ?? 0;

        this.message = await ctx.editOrReply(
            {
                content: "",
                embeds: [embeds[pages[userId]]],
                components: [this.getRow(userId)],
                flags,
            },
            true,
        );

        await this.createCollector();

        return this;
    }

    public async edit(body: InteractionCreateBodyRequest | InteractionMessageUpdateBodyRequest): Promise<this> {
        const { message, ctx } = this;
        if (!message) throw new Error("I can't set the page to an unresponded pagination.");

        await ctx.editOrReply(body);

        return this;
    }
}
