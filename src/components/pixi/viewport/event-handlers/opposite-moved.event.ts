import { MovedEvent } from "pixi-viewport/dist/types";
import {
    CachedViewportPosition,
    CachedViewportZoom,
} from "@/lib/stores/CachedViewport";
import { round } from "@/lib/utils/math/round";
import {
    Delta,
    ViewportHandlerParams,
    updateCachedViewportStore,
} from "./utils";

export const handleOppositeMove = (
    event: MovedEvent,
    params: ViewportHandlerParams,
    delta: Delta
) => {
    const { viewport, store, updateViewport } = params;
    switch (event.type) {
        case "drag": {
            const { x, y } = delta as CachedViewportPosition;
            viewport.moveCorner(viewport.corner.x - x, viewport.corner.y - y);
            break;
        }
        case "wheel": {
            const {
                value,
                offset: { x, y },
            } = delta as CachedViewportZoom;

            const oldScale = viewport.scaled;
            const newScale = round(oldScale * value, 3);

            if (newScale !== store.state.oppositeScaled) {
                viewport.setZoom(newScale);

                viewport.moveCorner(
                    viewport.corner.x - x,
                    viewport.corner.y - y
                );
            }

            viewport.emit("zoomed", {
                type: "wheel",
                viewport,
            });

            store.actions.viewport.opposite.setScaled(newScale);
            break;
        }
        default:
            console.warn("Unknown event type", event.type);
            break;
    }

    updateViewport();
    updateCachedViewportStore(params);
};
