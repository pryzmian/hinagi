const { config } = require("seyfert");
const { GatewayIntentBits } = require("seyfert/lib/types/index.js");

const isDev = process.argv.includes("--dev");

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
        output: "dist",
        base: "src",
        events: "events",
        commands: "commands",
    },
});
