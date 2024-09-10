import { createEvent } from "seyfert";
import { useManager } from "../utils/hooks";

const manager = useManager();

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
