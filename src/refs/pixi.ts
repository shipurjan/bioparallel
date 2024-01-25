import { Viewport } from "pixi-viewport";
import { Application, ICanvas } from "pixi.js";

// TODO: Refactor to use a single object for all refs if possible

export type GlobalCanvasRef = {
    app: Application<ICanvas> | null;
    viewport: Viewport | null;
};

export type GlobalRefs = {
    leftCanvas: GlobalCanvasRef;
    rightCanvas: GlobalCanvasRef;
};

export const REFS: GlobalRefs = {
    leftCanvas: {
        app: null as Application<ICanvas> | null,
        viewport: null as Viewport | null,
    },
    rightCanvas: {
        app: null as Application<ICanvas> | null,
        viewport: null as Viewport | null,
    },
};

export const useGlobalCanvasRef = (id: string) => {
    switch (id) {
        case "left":
            return REFS.leftCanvas;
        case "right":
            return REFS.rightCanvas;
        default:
            throw new Error(`Invalid id: ${id}`);
    }
};
