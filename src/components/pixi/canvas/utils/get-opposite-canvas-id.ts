import { CANVAS_ID } from "../hooks/useCanvasContext";

export const getOppositeCanvasId = (thisCanvasId: CANVAS_ID) =>
    thisCanvasId === CANVAS_ID.LEFT ? CANVAS_ID.RIGHT : CANVAS_ID.LEFT;
