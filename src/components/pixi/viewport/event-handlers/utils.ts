/* eslint-disable no-underscore-dangle */
import {
    CachedViewportPosition,
    CachedViewportStoreClass,
    CachedViewportZoom,
} from "@/lib/stores/CachedViewport";
import { Viewport as PixiViewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import {
    MARKING_TYPES,
    Marking,
    MarkingsStoreClass,
} from "@/lib/stores/Markings";
import { DashboardToolbarStore } from "@/lib/stores/DashboardToolbar";
import { getNormalizedPosition } from "../../overlays/utils/get-viewport-local-position";
import { CanvasMetadata } from "../../canvas/hooks/useCanvasContext";

export type ViewportHandlerParams = {
    viewport: PixiViewport;
    id: CanvasMetadata["id"];
    updateViewport: () => void;
    cachedViewportStore: CachedViewportStoreClass;
    markingsStore: MarkingsStoreClass;
};

export type Delta = CachedViewportZoom | CachedViewportPosition | null;

export function updateCachedViewportStore(params: ViewportHandlerParams) {
    const { cachedViewportStore: store, viewport } = params;
    store.actions.viewport.setScaled(viewport.scaled);
    store.actions.viewport.setPosition({
        x: viewport.position._x,
        y: viewport.position._y,
    });
}

export function getNormalizedMousePosition(
    event: FederatedPointerEvent,
    viewport: PixiViewport
): CachedViewportPosition {
    return getNormalizedPosition(viewport, {
        x: event.screenX,
        y: event.screenY,
    });
}

export function createMarking(
    id: Marking["id"],
    type: Marking["type"],
    angleRad: Marking["angleRad"],
    position: Marking["position"]
): Marking {
    const { size, backgroundColor, textColor } =
        DashboardToolbarStore.state.settings.marking;

    return {
        ...(id && { id }),
        selected: false,
        hidden: false,
        size,
        position,
        backgroundColor,
        textColor,
        type,
        angleRad,
    };
}

export function addMarkingToStore(
    newMarking: Marking,
    params: ViewportHandlerParams
) {
    const { markingsStore } = params;

    const id = markingsStore.state.temporaryMarking?.id;
    const { type: markingType, position: markingPos, angleRad } = newMarking;
    const { addOne: addMarking } = markingsStore.actions.markings;

    switch (markingType) {
        case MARKING_TYPES.POINT: {
            const marking = createMarking(id, markingType, null, markingPos);
            addMarking(marking);
            break;
        }
        case MARKING_TYPES.RAY: {
            const marking = createMarking(
                id,
                markingType,
                angleRad,
                markingPos
            );
            addMarking(marking);
            break;
        }
        default:
            markingType satisfies never;
            throw new Error(`Unknown marking type: ${markingType}`);
    }
}
