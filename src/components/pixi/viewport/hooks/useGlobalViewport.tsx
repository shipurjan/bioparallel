import { CanvasUpdaterOptions } from "@/lib/types/types";
import { useCanvas } from "../../canvas/hooks/useCanvas";
import { CanvasMetadata } from "../../canvas/hooks/useCanvasContext";
import { useCanvasUpdater } from "../../canvas/hooks/useCanvasUpdater";

export const useGlobalViewport = (
    id: CanvasMetadata["id"],
    options?: Omit<CanvasUpdaterOptions, "throttledUpdate">
) => {
    if (options?.autoUpdate === true) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCanvasUpdater(id, "viewport");
    }
    const { viewport } = useCanvas(id, true);
    return viewport;
};
