import { DispatchWithoutAction } from "react";
import { CANVAS_REFS } from "@/lib/refs/pixi";
import { useThrottledUpdate } from "@/lib/hooks/useThrottledUpdate";
import { useUpdater } from "@/lib/hooks/forceUpdate";
import { CanvasMetadata } from "./useCanvasContext";

export const useCanvas = <U extends true | false | undefined = undefined>(
    id: CanvasMetadata["id"],
    options?: {
        autoUpdate?: U;
    }
) => {
    const { autoUpdate } = options ?? {};
    const canvas = (() => {
        switch (id) {
            case "left":
                return CANVAS_REFS.leftCanvas;
            case "right":
                return CANVAS_REFS.rightCanvas;
            default:
                throw new Error(`Invalid id: ${id}`);
        }
    })();

    const interval = canvas.app?.ticker.deltaTime ?? 1;

    useThrottledUpdate(autoUpdate === true ? interval : undefined);
    const forceUpdate = useUpdater();
    const updateCanvas = (
        autoUpdate === false || autoUpdate === undefined
            ? forceUpdate
            : undefined
    ) as U extends true ? undefined : DispatchWithoutAction;

    return {
        canvas,
        update: updateCanvas,
    };
};
