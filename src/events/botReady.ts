import { createEvent } from "seyfert";
import container from "../inversify.config";
import { Manager } from "../structures";

const manager = container.get<Manager>(Manager);

export default createEvent({
    data: {
        name: "botReady",
    },
    run: async (user, client) => {
        const { logger } = client;

        if (!manager) return;

        manager.init({ id: client.botId, username: user.username });
        logger.info(`${user.username} is ready!`);
    },
});
