import { createEvent } from "seyfert";
import container from "../inversify.config";
import { Manager } from "../structures";

const manager = container.get<Manager>(Manager);

export default createEvent({
    data: { name: "raw" },
    run: async (payload: any) => await manager.sendRawData(payload),
});
