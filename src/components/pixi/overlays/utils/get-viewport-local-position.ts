import { Viewport } from "pixi-viewport";

export const getViewportLocalPosition = (
    viewport: Viewport
): [number, number] => {
    return [
        // eslint-disable-next-line no-underscore-dangle
        viewport.position.x + viewport._localBounds.minX * viewport.scale.x,
        // eslint-disable-next-line no-underscore-dangle
        viewport.position.y + viewport._localBounds.minY * viewport.scale.y,
    ];
};

export const getRelativePosition = (
    viewport: Viewport,
    pos: [number, number]
): [number, number] => {
    return [
        pos[0] * (viewport.screenWorldWidth / viewport.worldWidth),
        pos[1] * (viewport.screenWorldHeight / viewport.worldHeight),
    ];
};
