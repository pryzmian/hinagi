import config from "config";
import { Command, type CommandContext, Declare, Middlewares, Options, createStringOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Utils } from "../../structures";
import { useManager } from "../../utils/hooks";
import type { EmbedConfig } from "../../utils/types";

const options = {
    query: createStringOption({
        description: "URL of a song or a search query.",
        required: true,
        autocomplete: async (int) => {
            const manager = useManager();
            if (!manager) return;

            const query = int.getInput();

            if (!query)
                return int.respond([
                    { name: "No query provided", value: "https://open.spotify.com/track/1jKXjxMWlq4BhH6f9GtZbu?si=e50c0b078eac45f6" },
                ]);

            const { tracks, playlist } = await manager.search(query, int.user);

            if (playlist)
                return int.respond([
                    {
                        name: `Playlist: ${Utils.spliceName(playlist.name, 100)}`,
                        value: playlist.uri ?? query,
                    },
                ]);

            return int.respond(
                tracks.map((track) => ({
                    name: `${Utils.spliceName(track.info.title, 100)} (Author: ${track.info.author})`,
                    value: track.info.uri,
                })),
            );
        },
    }),
};

@Declare({
    name: "play",
    description: "Plays the provided song or search query",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["inVoiceChannel", "sameVoiceChannel"])
export default class PlayCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, member, author } = ctx;
        const { query } = options;

        const manager = useManager();
        if (!manager) return;
        
        const { colors, emojis } = config.get<EmbedConfig>("embedConfig");

        const voiceChannel = client.cache.voiceStates?.get(member?.id!, ctx.guildId!);

        if (!manager.isNodeAvailable()) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: colors.transparent,
                        description: `${emojis.error} There are no available nodes to play music, please try again later!`,
                    },
                ],
            });
        }

        await ctx.deferReply();

        const player = manager.createPlayer({
            guildId: ctx.guildId!,
            voiceChannelId: voiceChannel?.channelId!,
            textChannelId: ctx.channelId!,
            selfDeaf: true,
            volume: 100,
        });

        const { loadType, tracks, playlist } = await manager.search(query, author);
        player.set("commandContext", ctx);

        if (!player.connected) await player.connect();

        switch (loadType) {
            case "empty":
            case "error":
                {
                    if (!player.queue.current) await player.destroy();

                    await ctx.editOrReply({
                        embeds: [
                            {
                                color: colors.transparent,
                                description: `${emojis.error} No results found for \`${query}\`!`,
                            },
                        ],
                    });
                }
                break;

            case "search":
            case "track":
                {
                    await player.queue.add(tracks[0]);
                    if (!player.playing) await player.play();

                    await ctx.editOrReply({
                        embeds: [
                            {
                                color: colors.transparent,
                                description: `${emojis.success} Added *${Utils.toHyperLink(tracks[0])}* to the queue!`,
                            },
                        ],
                    });
                }
                break;

            case "playlist": {
                await player.queue.add(tracks);
                if (!player.playing) await player.play();

                await ctx.editOrReply({
                    embeds: [
                        {
                            color: colors.transparent,
                            description: `${emojis.success} Added *${Utils.toHyperLink(playlist!)}* to the queue! (${tracks.length} songs)`,
                        },
                    ],
                });
            }
        }
    }
}