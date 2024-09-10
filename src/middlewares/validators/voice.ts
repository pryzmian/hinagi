import { createMiddleware } from "seyfert";

export const inVoiceChannel = createMiddleware<void>(async ({ context, next, stop }) => {
    const { member, guildId, client } = context;
    const voiceChannel = client.cache.voiceStates?.get(member?.id!, guildId!);

    if (!voiceChannel) return stop("You need to be in a voice channel to perform this action!");

    return next();
});

export const sameVoiceChannel = createMiddleware<void>(async ({ context, next, stop }) => {
    const { member, guildId, client } = context;
    const voiceChannel = client.cache.voiceStates?.get(member?.id!, guildId!);
    const botChannel = client.cache.voiceStates?.get(client.botId!, guildId!);

    if (botChannel && botChannel.channelId !== voiceChannel?.channelId)
        return stop("You need to be in the same voice channel as me to perform this action!");

    return next();
});
