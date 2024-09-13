import container from "../../container";

import { createMiddleware } from "seyfert";
import { Manager } from "../../structures";

const manager = container.get(Manager);

export const queueExistsMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);

    if (!player) return stop("There is no active queue in this server!");

    return next();
});

export const queueIsEmptyMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);
    const isAutoplayActive = !!player?.get("enabledAutoplay");

    if (!(isAutoplayActive || player?.queue.tracks.length || player?.queue.current))
        return stop("There are no songs in the queue, try adding some songs first!");

    return next();
});

export const historyIsEmptyMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);

    if (!player?.queue.previous.length) return stop("There are no songs in the history, try playing some songs first!");

    return next();
});

export const trackExistsMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId, interaction } = context;
    const player = manager.getPlayer(guildId!);
    const messageId = player?.get<string>("messageId") ?? "";

    if (interaction.message?.id !== messageId) return stop("This song is no longer in the queue!");

    return next();
});

export const queueNotPlayingMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);

    if (!player?.playing || player?.paused) return stop("The queue is not playing, try resuming or adding a song to the queue first!");

    return next();
});
