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

// Globalny obiekt przechowujący referencje do canvasów, żeby były dostępny w całym projekcie
// W komponentach reactowych zalecane jest używanie hooków useGlobalApp() oraz useGlobalViewport(),
// które zwrócą odpowiednie referencje oraz obsłużą re-rendery przy zmianie
//
// app - instancja pixi.js, tu obsługiwana jest cała grafika 2D związane z canvasem
// viewport - instancja pixi-viewport, obszar w do którego ładowane są obrazy śladów kryminalistycznych, jest childem app
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
