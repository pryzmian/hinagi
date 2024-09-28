import { createEvent } from "seyfert";
import { emptyChannel } from "#hinagi/functions";

export default createEvent({
    data: {
        name: "voiceStateUpdate",
    },
    run: async ([newState, oldState], client) => {
        await emptyChannel(client, newState, oldState);
    },
});
