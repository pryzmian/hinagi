import { createEvent } from "seyfert";
import { useManager } from "../utils/hooks";

const player = useManager();

export default createEvent({
    data: {
        name: "botReady",
    },
    run: async (user, client) => {
        const { logger } = client;
        player.init({ id: client.botId, username: user.username });
        logger.info(`${user.username} is ready!`);
    },
});
