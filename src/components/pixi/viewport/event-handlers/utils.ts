/* eslint-disable no-underscore-dangle */
import {
    CachedViewportPosition,
    CachedViewportStoreClass,
    CachedViewportZoom,
} from "@/lib/stores/CachedViewport";
import { Viewport as PixiViewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import { MARKING_TYPES, Marking, MarkingsStore } from "@/lib/stores/Markings";
import { DashboardToolbarStore } from "@/lib/stores/DashboardToolbar";
import { getNormalizedPosition } from "../../overlays/utils/get-viewport-local-position";
import { CanvasMetadata } from "../../canvas/hooks/useCanvasContext";

export type ViewportHandlerParams = {
    viewport: PixiViewport;
    id: CanvasMetadata["id"];
    updateViewport: () => void;
    store: CachedViewportStoreClass;
};

export type Delta = CachedViewportZoom | CachedViewportPosition | null;

export function calculatePreviousValues(params: ViewportHandlerParams) {
    const { store, viewport } = params;
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
    type: Marking["type"],
    angleRad: Marking["angleRad"],
    position: Marking["position"]
): Marking | null {
    const { size, backgroundColor, textColor } =
        DashboardToolbarStore.state.settings.marking;

    return {
        size,
        position,
        backgroundColor,
        textColor,
        type,
        angleRad,
    };
}

export function addMarkingToStore(
    store: CachedViewportStoreClass,
    id: CanvasMetadata["id"],
    markingType: Marking["type"],
    clickPosition: Marking["position"]
) {
    switch (markingType) {
        case MARKING_TYPES.POINT: {
            const marking = createMarking(markingType, null, clickPosition);
            if (marking === null) return;

            MarkingsStore(id).actions.temporaryMarking.setTemporaryMarking(
                null
            );
            MarkingsStore(id).actions.markings.addOne(marking);
            break;
        }
        case MARKING_TYPES.RAY: {
            const marking = createMarking(
                markingType,
                store.state.rayAngleRad,
                store.state.rayPosition
            );
            if (marking === null) return;

            MarkingsStore(id).actions.temporaryMarking.setTemporaryMarking(
                null
            );
            MarkingsStore(id).actions.markings.addOne(marking);
            break;
        }
        default:
            throw new Error(`Invalid marking type: ${markingType}`);
    }
}
