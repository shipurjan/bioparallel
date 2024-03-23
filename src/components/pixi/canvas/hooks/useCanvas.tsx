import { CANVAS_REFS } from "@/lib/refs/pixi";
import { CANVAS_ID, CanvasMetadata } from "./useCanvasContext";

export const useCanvas = (id: CanvasMetadata["id"], preventError?: boolean) => {
    if (preventError !== true)
        throw new Error(
            "Prefer using useGlobalApp and useGlobalViewport hooks instead of this hook. If you know what you're doing, pass a parameter to prevent this error."
        );

    return (() => {
        switch (id) {
            case CANVAS_ID.LEFT:
                return CANVAS_REFS.leftCanvas;
            case CANVAS_ID.RIGHT:
                return CANVAS_REFS.rightCanvas;
            default:
                id satisfies never;
                throw new Error(`Unknown canvas ID: ${id}`);
        }
    })();
};
