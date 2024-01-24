import { Viewport } from "pixi-viewport";
import { Application, ICanvas } from "pixi.js";

// TODO: Refactor to use a single object for all refs if possible

export const GLOBAL = {
    app: null as Application<ICanvas> | null,
    viewport: null as Viewport | null,
};
