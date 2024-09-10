import { createEvent } from "seyfert";
import { useManager } from "../utils/hooks";

const player = useManager();

export default createEvent({
    data: { name: "raw" },
    run: async (payload: any, client) => await player.sendRawData(payload),
});
