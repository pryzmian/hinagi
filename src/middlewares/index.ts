import { inVoiceChannelMiddleware, sameVoiceChannelMiddleware } from "./validators/voice";

export const Middlewares = {
    inVoiceChannel: inVoiceChannelMiddleware,
    sameVoiceChannel: sameVoiceChannelMiddleware,
} as const;
