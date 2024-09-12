import { createEvent } from "seyfert";
import container from "../container";
import { Manager } from "../structures";

const manager = container.get(Manager);

export default createEvent({
    data: { name: "raw" },
    run: async (payload: any) => await manager.sendRawData(payload),
});
