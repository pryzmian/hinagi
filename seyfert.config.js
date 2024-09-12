const { config } = require("seyfert");
const { GatewayIntentBits } = require("seyfert/lib/types");

const isWindows = process.platform === "win32";
const isDev = process.argv.includes("--dev");
const output = isWindows && isDev ? "src" : "dist";

module.exports = config.bot({
    debug: isDev,
    token: process.env.DISCORD_TOKEN,
    applicationId: process.env.APPLICATION_ID,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    locations: {
        output,
        base: "src",
        events: "events",
        commands: "commands",
    },
});
