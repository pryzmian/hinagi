import { createEvent } from "seyfert";

export default createEvent({
    data: { name: "raw" },
    run: async (payload: any, client) => await client.manager.sendRawData(payload),
});
