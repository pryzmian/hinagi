import type { BotConfig, EmbedConfig, PlayerConfig } from "../src/utils/types";

export const botConfig = {
    prefix: "!",
    supportServer: "https://discord.gg/hEMYrjuVtd",
    inviteLink: `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&permissions=4298131712&integration_type=0&scope=applications.commands+bot`,
    sourceCode: "https://github.com/pryzmian/hinagi",
    goodByeImage:
        "https://cdn.discordapp.com/attachments/1228578969184632882/1284555800014098533/5virPih.gif?ex=66e70f50&is=66e5bdd0&hm=325c437a00e1f5ed54d88f8ba824e65787f365d0ca02516b44f7165bd56c4287&",
    systemChannel: "",
} satisfies BotConfig;

export const embedConfig = {
    colors: {
        error: 0xf44336,
        success: 0x2196f3,
        warning: 0xffc107,
        info: 0xffa500,
        transparent: 0x2b2d31, // not really transparent, it's just the color of the dark theme background
    },
    emojis: {
        error: "❌",
        success: "✅",
        warning: "⚠️",
        previous: "⏮️",
        pause: "⏸️",
        next: "⏭️",
        stop: "⏹️",
        queue: "📜",
        playing: "🎶",
        upnext: "🔄",
        waving: "👋",
        support: "🚨",
        source: "💻",
        invite: "🔗",
    },
} satisfies EmbedConfig;

export const playerConfig = {
    defaultVolume: 100,
    defaultSearchPlatform: "spsearch",
    emptyChannelTimeout: 300_000, // 5 minutes
    nodes: [
        {
            id: process.env.LAVALINK_NODE_ID ?? "main",
            host: process.env.LAVALINK_HOST ?? "localhost",
            port: Number(process.env.LAVALINK_PORT) ?? 2333,
            authorization: process.env.LAVALINK_AUTHORIZATION ?? "youshallnotpass",
        },
    ],
} satisfies PlayerConfig;
