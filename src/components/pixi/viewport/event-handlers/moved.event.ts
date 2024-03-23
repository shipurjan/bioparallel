/* eslint-disable no-underscore-dangle */
import { MovedEvent } from "pixi-viewport/dist/types";
import { Viewport as PixiViewport } from "pixi-viewport";
import { DashboardToolbarStore } from "@/lib/stores/DashboardToolbar";
import { Delta, ViewportHandlerParams, calculatePreviousValues } from "./utils";
import { useGlobalViewport } from "../hooks/useGlobalViewport";
import { getOppositeCanvasId } from "../../canvas/utils/get-opposite-canvas-id";

function calculateDelta(
    e: MovedEvent,
    params: ViewportHandlerParams,
    oppositeViewport: PixiViewport
): Delta {
    const { viewport, store } = params;
    switch (e.type) {
        case "drag": {
            const isScaleSync =
                DashboardToolbarStore.state.settings.viewport.scaleSync;
            return {
                x:
                    (viewport.position._x - store.state.position.x) /
                    (isScaleSync ? viewport.scaled : oppositeViewport.scaled),
                y:
                    (viewport.position._y - store.state.position.y) /
                    (isScaleSync ? viewport.scaled : oppositeViewport.scaled),
            };
        }
        case "wheel": {
            return {
                value: viewport.scaled / store.state.scaled,
                offset: {
                    x:
                        (viewport.position._x - store.state.position.x) /
                        viewport.scaled,
                    y:
                        (viewport.position._y - store.state.position.y) /
                        viewport.scaled,
                },
            };
        }
        default:
            return null;
    }
}

export const handleMove = (e: MovedEvent, params: ViewportHandlerParams) => {
    const { id, updateViewport } = params;

    updateViewport();

    const isLocked = DashboardToolbarStore.state.settings.viewport.locked;

    if (!isLocked) {
        calculatePreviousValues(params);
        return;
    }

    // Jeśli Viewport jest zalockowany (L): wyślij eventy do drugiego viewportu

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const oppositeViewport = useGlobalViewport(getOppositeCanvasId(id));
    if (oppositeViewport === null) return;

    const delta = calculateDelta(e, params, oppositeViewport);
    calculatePreviousValues(params);
    oppositeViewport.emit("opposite-moved", e, delta);
};
