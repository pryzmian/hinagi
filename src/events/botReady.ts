import container from "../container";

import { createEvent } from "seyfert";
import { Manager } from "../structures";

export default createEvent({
    data: {
        name: "botReady",
    },
    run: async (user, client) => {
        const { logger } = client;
        const manager = container.get(Manager);

        await manager.load();
        await manager.init({ id: client.botId, username: user.username });

        logger.info(`${user.username} is ready!`);
    },
});
