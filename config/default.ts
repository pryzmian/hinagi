import type { BotConfig, EmbedConfig, PlayerConfig } from "../src/utils/types";

export const botConfig = {
    prefix: "!",
    supportServer: "https://discord.gg/hEMYrjuVtd",
    inviteLink: `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&permissions=4298131712&integration_type=0&scope=applications.commands+bot`,
    sourceCode: "https://github.com/pryzmian/hinagi",
} satisfies BotConfig;

export const embedConfig = {
    colors: {
        error: 0xf44336,
        success: 0x2196f3,
        warning: 0xffc107,
        info: 0xffa500,
        transparent: 0x27272f, // not really transparent, it's just the color of the dark theme background
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
        thinking: "🤔",
        support: "🚨",
        source: "💻",
        invite: "🔗",
    },
} satisfies EmbedConfig;

export const playerConfig = {
    defaultVolume: 100,
    defaultSearchPlatform: "spsearch",
    emptyChannelTimeout: 300_000, // 5 minutes
    maxQueueSize: null,
    nodes: [
        {
            id: process.env.LAVALINK_NODE_ID!,
            host: process.env.LAVALINK_HOST!,
            port: Number(process.env.LAVALINK_PORT),
            authorization: process.env.LAVALINK_AUTHORIZATION!,
        },
    ],
} satisfies PlayerConfig;
