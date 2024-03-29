import { Viewport } from "pixi-viewport";

export const getViewportPosition = ({
    position,
}: Viewport): { x: number; y: number } => {
    return {
        x: position.x,
        y: position.y,
    };
};

export const getViewportGlobalPosition = ({
    x,
    y,
}: Viewport): { x: number; y: number } => {
    return { x, y };
};

export const getRelativePosition = (
    viewport: Viewport,
    { x, y }: { x: number; y: number }
): { x: number; y: number } => {
    return {
        x: x * (viewport.screenWorldWidth / viewport.worldWidth),
        y: y * (viewport.screenWorldHeight / viewport.worldHeight),
    };
};

export const getNormalizedPosition = (
    viewport: Viewport,
    { x, y }: { x: number; y: number }
): { x: number; y: number } => {
    const pos = getViewportPosition(viewport);
    return {
        x: (x - pos.x) / viewport.scaled,
        y: (y - pos.y) / viewport.scaled,
    };
};
