import type { MiddlewareContext } from "seyfert";
import { historyIsEmpty, queueExists, queueIsEmpty, queueNotPlaying, trackExists } from "./validators/queue";
import { inVoiceChannel, sameVoiceChannel } from "./validators/voice";

export const Middlewares = {
    queueExists,
    queueIsEmpty,
    historyIsEmpty,
    trackExists,
    queueNotPlaying,
    inVoiceChannel,
    sameVoiceChannel,
} satisfies Record<string, MiddlewareContext>;
