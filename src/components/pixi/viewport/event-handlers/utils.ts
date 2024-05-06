/* eslint-disable no-underscore-dangle */
import {
    CachedViewportPosition,
    CachedViewportStoreClass,
    CachedViewportZoom,
} from "@/lib/stores/CachedViewport";
import { Viewport as PixiViewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import {
    InternalMarking,
    MARKING_TYPES,
    Marking,
    MarkingsStoreClass,
} from "@/lib/stores/Markings";
import { DashboardToolbarStore } from "@/lib/stores/DashboardToolbar";
import { isInternalMarking } from "@/components/information-tabs/markings-info/columns";
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
    type: Marking["type"],
    angleRad: Marking["angleRad"],
    position: Marking["position"],
    label?: InternalMarking["label"]
): Marking {
    const { size, backgroundColor, textColor } =
        DashboardToolbarStore.state.settings.marking;

    return {
        ...(label !== undefined && { label }),
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
    newMarking: Marking & Partial<InternalMarking>,
    params: ViewportHandlerParams
) {
    const { markingsStore } = params;

    const {
        type: markingType,
        position: markingPos,
        angleRad,
        label,
    } = newMarking;
    const { addOne: addMarking } = markingsStore.actions.markings;

    switch (markingType) {
        case MARKING_TYPES.POINT: {
            const marking = createMarking(markingType, null, markingPos, label);
            return addMarking(marking);
        }
        case MARKING_TYPES.RAY: {
            const marking = createMarking(
                markingType,
                angleRad,
                markingPos,
                label
            );
            return addMarking(marking);
        }
        default:
            markingType satisfies never;
            throw new Error(`Unknown marking type: ${markingType}`);
    }
}

export function addOrEditMarking(
    marking: InternalMarking,
    params: ViewportHandlerParams
) {
    const { markingsStore } = params;
    const { selectedMarking } = markingsStore.state;

    if (selectedMarking === null) {
        addMarkingToStore(marking, params);
        return;
    }

    if (isInternalMarking(selectedMarking)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, label, ...newProps } = marking;

        markingsStore.actions.markings.editOneById(
            selectedMarking.id,
            newProps
        );
        return;
    }

    const newMarking = addMarkingToStore(
        {
            ...marking,
            boundMarkingId: selectedMarking.boundMarkingId,
            label: selectedMarking.label,
        },
        params
    );
    markingsStore.actions.selectedMarking.setSelectedMarking(newMarking);
}
