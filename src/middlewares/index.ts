import { queueExistsMiddleware } from "./validators/queue";
import { inVoiceChannelMiddleware, sameVoiceChannelMiddleware } from "./validators/voice";

export const Middlewares = {
    inVoiceChannel: inVoiceChannelMiddleware,
    sameVoiceChannel: sameVoiceChannelMiddleware,
    queueExists: queueExistsMiddleware,
} as const;
