import type { MiddlewareContext } from "seyfert";
import { inVoiceChannelMiddleware, sameVoiceChannelMiddleware } from "./validators/voice";

export const Middlewares = {
    inVoiceChannel: inVoiceChannelMiddleware,
    sameVoiceChannel: sameVoiceChannelMiddleware,
} satisfies Record<string, MiddlewareContext>;
