import type { LavalinkNodeOptions, SearchPlatform } from "lavalink-client";

export type BotConfig = {
    prefix: string;
    supportServer: string;
    inviteLink: string;
    sourceCode: string;
    goodByeImage: string;
    systemChannel: string;
};

export type EmbedConfig = {
    colors: {
        error: number;
        success: number;
        warning: number;
        info: number;
        transparent: number;
    };
    emojis: {
        error: string;
        success: string;
        warning: string;
        previous: string;
        pause: string;
        next: string;
        stop: string;
        queue: string;
        playing: string;
        upnext: string;
        waving: string;
        voice: string;
        support: string;
        source: string;
        invite: string;
    };
};

export type PlayerConfig = {
    defaultVolume: number;
    defaultSearchPlatform: SearchPlatform;
    emptyChannelTimeout: number;
    nodes: LavalinkNodeOptions[];
};
