import { createMiddleware } from "seyfert";

export const inVoiceChannelMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { member, client } = context;
    const voiceChannel = client.cache.voiceStates?.get(member?.id!, context.guildId!);

    if (!voiceChannel) return stop("You need to be in a voice channel to perform this action!");

    return next();
});

export const sameVoiceChannelMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { member, client } = context;
    const voice = client.cache.voiceStates?.get(member?.id!, context.guildId!);
    const botChannel = client.cache.voiceStates?.get(client.botId!, context.guildId!);

    if (botChannel && voice!.channelId !== botChannel.channelId)
        return stop("You need to be in the same voice channel as me to perform this action!");

    return next();
});
