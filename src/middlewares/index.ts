import { permissionsMiddleware } from "./validators/permissions.js";
import { historyIsEmptyMiddleware, queueExistsMiddleware, queueIsEmptyMiddleware, trackExistsMiddleware } from "./validators/queue.js";
import { inVoiceChannelMiddleware, sameVoiceChannelMiddleware } from "./validators/voice.js";

export const hinagiMiddlewares = {
    inVoiceChannel: inVoiceChannelMiddleware,
    sameVoiceChannel: sameVoiceChannelMiddleware,
    queueExists: queueExistsMiddleware,
    queueIsEmpty: queueIsEmptyMiddleware,
    historyIsEmpty: historyIsEmptyMiddleware,
    trackExists: trackExistsMiddleware,
    hasPermissions: permissionsMiddleware,
};
