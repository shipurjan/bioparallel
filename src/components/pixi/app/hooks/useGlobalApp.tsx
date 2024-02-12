import { CanvasUpdaterOptions } from "@/lib/types/types";
import { useCanvas } from "../../canvas/hooks/useCanvas";
import { CanvasMetadata } from "../../canvas/hooks/useCanvasContext";
import {
    useCanvasUpdater,
    useThrottledCanvasUpdater,
} from "../../canvas/hooks/useCanvasUpdater";

export const useGlobalApp = (
    id: CanvasMetadata["id"],
    options?: CanvasUpdaterOptions
) => {
    if (options?.autoUpdate === true) {
        if (options.throttledUpdate === true) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useThrottledCanvasUpdater(id);
        } else {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useCanvasUpdater(id, "app");
        }
    }
    const { app } = useCanvas(id, true);
    return app;
};
