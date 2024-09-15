# 🚨 Readme and bot are still under development 🚨
> If you need help settings up your lavalink server, please refer to [this guide](https://github.com/Ganyu-Studios/stelle-music/blob/main/LAVALINK.md) made by [@Ganyu-Studios](https://github.com/Ganyu-Studios)

# Start the bot
> To start the bot, you need to have `pnpm` installed on your system. If you don't have it installed, please refer to the [official guide](https://pnpm.io/installation). After installing `pnpm`, run the following commands:
```bash
pnpm install
pnpm build
pnpm start
```
> or this one if you want to clean the dist folder before starting the bot (in case the dist folder is already created)
```bash
pnpm start:clean
```
# Configuring the bot
> To edit the configuration, you will need to create a `local.ts` file in the `config` folder. You can copy the content of the `default.ts` file to get started.

# Environment variables and dependencies
> The bot uses the [dotenv](https://www.npmjs.com/package/dotenv) package to load environment variables. The required environment variables are in the `.env.example` file, you just need to create a `.env` file and put the required variables in it.
> You need to install the latest version of [NodeJS](https://nodejs.org/en/download/)

# Hinagi
> This bot is using [Seyfert](https://github.com/tiramisulabs/seyfert) as the framework to interact with Discord API, [Lavalink](https://github.com/lavalink-devs/Lavalink) as the music server and [lavalink-client](https://github.com/Tomato6966/lavalink-client) as the client to interact with Lavalink.

# Credits and Acknowledgements
> - Special thanks to [@EvilG-MC](https://github.com/EvilG-MC) for providing feedback during the development of the bot (although the bot is not finished yet) :pray:

