import { createContext, useContext } from "react";

export const enum CANVAS_ID {
    LEFT = "left",
    RIGHT = "right",
}

export type CanvasMetadata = {
    id: CANVAS_ID;
};

export const CanvasContext = createContext<CanvasMetadata | undefined>(
    undefined
);

export function useCanvasContext() {
    const canvasInfo = useContext(CanvasContext);

    if (canvasInfo === undefined) {
        throw new Error("useCanvasContext must be used with a CanvasContext");
    }

    return canvasInfo;
}
