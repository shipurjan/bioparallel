import { Viewport } from "pixi-viewport";
import { Application, ICanvas } from "pixi.js";

export type CanvasRef = {
    app: Application<ICanvas> | null;
    viewport: Viewport | null;
};

export type GlobalCanvasRefs = {
    leftCanvas: CanvasRef;
    rightCanvas: CanvasRef;
};

export const CANVAS_REFS: GlobalCanvasRefs = {
    leftCanvas: {
        app: null as Application<ICanvas> | null,
        viewport: null as Viewport | null,
    },
    rightCanvas: {
        app: null as Application<ICanvas> | null,
        viewport: null as Viewport | null,
    },
};
