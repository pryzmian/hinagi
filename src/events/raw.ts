import { createEvent } from "seyfert";
import { useManager } from "../utils/hooks";

const manager = useManager();

export default createEvent({
    data: { name: "raw" },
    run: async (payload: any) => await manager?.sendRawData(payload),
});
