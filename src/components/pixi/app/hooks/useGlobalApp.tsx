import { CanvasUpdaterOptions } from "@/lib/types/types";
import { CanvasUpdater } from "@/lib/stores/CanvasUpdater";
import { useCanvas } from "../../canvas/hooks/useCanvas";
import { CanvasMetadata } from "../../canvas/hooks/useCanvasContext";

export const useGlobalApp = (
    id: CanvasMetadata["id"],
    options?: CanvasUpdaterOptions
) => {
    if (options?.autoUpdate === true) {
        if (options.throttledUpdate === true) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            CanvasUpdater.useThrottled(30);
        } else {
            CanvasUpdater.use(id, "app");
        }
    }
    const { app } = useCanvas(id, true);
    return app;
};
