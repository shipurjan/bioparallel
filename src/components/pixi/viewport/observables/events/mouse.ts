import { Viewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import { fromEvent } from "rxjs";

export const mouseEvent = (viewport: Viewport, eventName: string) =>
    fromEvent<FederatedPointerEvent>(viewport, eventName);
