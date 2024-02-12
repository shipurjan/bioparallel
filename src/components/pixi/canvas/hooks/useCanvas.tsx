import { CANVAS_REFS } from "@/lib/refs/pixi";
import { CanvasMetadata } from "./useCanvasContext";

export const useCanvas = (id: CanvasMetadata["id"], preventError?: boolean) => {
    if (preventError !== true)
        throw new Error(
            "Prefer using useGlobalApp and useGlobalViewport hooks instead of this hook. If you know what you're doing, pass a parameter to prevent this error."
        );

    return (() => {
        switch (id) {
            case "left":
                return CANVAS_REFS.leftCanvas;
            case "right":
                return CANVAS_REFS.rightCanvas;
            default:
                throw new Error(`Invalid id: ${id}`);
        }
    })();
};
