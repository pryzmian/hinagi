import { type AnyContext, createMiddleware } from "seyfert";

export const queueExistsMiddleware = createMiddleware<void, AnyContext>(async ({ context, next, stop }) => {
    const { guildId, client } = context;
    const player = client.manager.getPlayer(guildId!);

    if (!player) return stop("There is no active queue in this server!");

    return next();
});

export const queueIsEmptyMiddleware = createMiddleware<void, AnyContext>(async ({ context, next, stop }) => {
    const { guildId, client } = context;
    const player = client.manager.getPlayer(guildId!);

    const isAutoplayActive = !!player?.get("enabledAutoplay");
    const queueLength = player.queue.tracks.length + Number(!!player.queue.current);

    if (!isAutoplayActive && queueLength === 0) return stop("There are no songs in the queue, try adding some songs first!");

    return next();
});

export const historyIsEmptyMiddleware = createMiddleware<void, AnyContext>(async ({ context, next, stop }) => {
    const { guildId, client } = context;
    const player = client.manager.getPlayer(guildId!);

    if (!player.queue.previous.length) return stop("There are no songs in the history, try playing some songs first!");

    return next();
});

export const trackExistsMiddleware = createMiddleware<void, AnyContext>(async ({ context, next, stop }) => {
    const { guildId, interaction, client } = context;
    const player = client.manager.getPlayer(guildId!);
    const messageId = player?.get<string>("messageId") ?? "";

    if (interaction.message?.id !== messageId) return stop("This song is no longer in the queue!");

    return next();
});
