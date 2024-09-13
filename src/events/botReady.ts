import { createEvent } from "seyfert";

export default createEvent({
    data: {
        name: "botReady",
    },
    run: async (user, client) => {
        const { logger, manager } = client;

        await manager.init({ id: client.botId, username: user.username });

        logger.info(`${user.username} is ready!`);
    },
});
