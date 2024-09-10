import { createMiddleware } from "seyfert";
import { useManager } from "../../utils/hooks";

const manager = useManager();

export const queueExists = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);

    if (!player) return stop("There is no active queue in this server!");

    return next();
});

export const queueIsEmpty = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);
    const isAutoplayActive = !!player?.get("enabledAutoplay");

    if (!(isAutoplayActive || player?.queue.tracks.length)) return stop("There are no songs in the queue, try adding some songs first!");

    return next();
});

export const historyIsEmpty = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);

    if (!player?.queue.previous.length) return stop("There are no songs in the history, try playing some songs first!");

    return next();
});

export const trackExists = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId, interaction } = context;
    const player = manager.getPlayer(guildId!);
    const messageId = player?.get<string>("messageId") ?? "";

    if (interaction.message?.id !== messageId) return stop("This song is no longer in the queue!");

    return next();
});

export const queueNotPlaying = createMiddleware<void>(async ({ context, next, stop }) => {
    const { guildId } = context;
    const player = manager.getPlayer(guildId!);

    if (!player.playing || player.paused) return stop("The queue is not playing, try resuming or adding a song to the queue first!");

    return next();
});
