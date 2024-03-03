import { Viewport } from "pixi-viewport";

export const emitFitEvents = (viewport: Viewport | null) => {
    viewport?.emit("moved", {
        // @ts-expect-error - fitWorld is not in the type
        type: "fit-height",
        viewport,
    });
    viewport?.emit("zoomed", {
        type: "wheel",
        viewport,
    });
};

export const fitHeight = (viewport: Viewport | null) => {
    viewport?.fitHeight();
    viewport?.moveCorner(0, 0);
};

export const fitWidth = (viewport: Viewport | null) => {
    viewport?.fitWidth();
    viewport?.moveCorner(0, 0);
};

export const fitWorld = (viewport: Viewport | null) => {
    viewport?.fitWorld();
    viewport?.moveCorner(0, 0);
};
