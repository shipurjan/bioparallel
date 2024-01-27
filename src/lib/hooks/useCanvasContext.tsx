import { createContext, useContext } from "react";

export type CanvasMetadata = {
    id: string;
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
