import { createMiddleware } from "seyfert";

export const permissionsMiddleware = createMiddleware<void>(async ({ context, next, stop }) => {
    const { client, member } = context;

    const me = context.me();
    if (!me) return;

    const voiceChannel = await client.cache.voiceStates?.get(member?.id!, context.guildId!)?.channel();

    const permissions = await client.channels.memberPermissions(voiceChannel!.id!, me);
    const missingPermissions = permissions.keys(
        permissions.missings(voiceChannel!.isStage() ? ["MuteMembers"] : ["Connect", "Speak", "ViewChannel"]),
    );

    if (missingPermissions.length) {
        return stop(`I am missing the following permissions to play music in <#${voiceChannel!.id}>: ${missingPermissions.join(", ")}`);
    }

    return next();
});
