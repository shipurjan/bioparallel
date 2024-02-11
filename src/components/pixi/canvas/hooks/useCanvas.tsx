import { CANVAS_REFS } from "@/lib/refs/pixi";
import { CanvasMetadata } from "./useCanvasContext";

export const useCanvas = (id: CanvasMetadata["id"]) => {
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
