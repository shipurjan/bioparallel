/* eslint-disable no-underscore-dangle */
import { DashboardToolbarStore } from "@/lib/stores/DashboardToolbar";
import { MovedEvent, ZoomedEvent } from "pixi-viewport/dist/types";
import { FederatedPointerEvent } from "pixi.js";
import { Viewport as PixiViewport } from "pixi-viewport";
import { round } from "@/lib/utils/math/round";
import { ShallowViewportStore } from "@/lib/stores/ShallowViewport";
import { Marking, MarkingsStore } from "@/lib/stores/Markings";
import {
    CachedViewportPosition,
    CachedViewportStoreClass,
    CachedViewportZoom,
} from "@/lib/stores/CachedViewport";
import { getNormalizedPosition } from "../overlays/utils/get-viewport-local-position";
import { useGlobalViewport } from "./hooks/useGlobalViewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";

type Delta = CachedViewportZoom | CachedViewportPosition | null;

export type ViewportHandlerParams = {
    viewport: PixiViewport;
    id: CanvasMetadata["id"];
    updateViewport: () => void;
    store: CachedViewportStoreClass;
};

function calculatePreviousValues(params: ViewportHandlerParams) {
    const { store, viewport } = params;
    store.actions.viewport.setScaled(viewport.scaled);
    store.actions.viewport.setPosition({
        x: viewport.position._x,
        y: viewport.position._y,
    });
}

function getNormalizedMousePosition(
    event: FederatedPointerEvent,
    viewport: PixiViewport
): CachedViewportPosition {
    return getNormalizedPosition(viewport, {
        x: event.screenX,
        y: event.screenY,
    });
}

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

function followLockedViewport(
    event: MovedEvent,
    params: ViewportHandlerParams,
    delta: Delta
) {
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

            if (newScale !== store.state.otherScaled) {
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

            store.actions.viewport.other.setScaled(newScale);
            break;
        }
        default:
            break;
    }

    updateViewport();
    calculatePreviousValues(params);
}

function createMarking(
    id: CanvasMetadata["id"],
    type: Marking["type"],
    angleRad: Marking["angleRad"],
    position: Marking["position"]
): Marking | null {
    return {
        canvasId: id,
        size: DashboardToolbarStore.state.settings.marking.size,
        position,
        backgroundColor:
            DashboardToolbarStore.state.settings.marking.backgroundColor,
        textColor: DashboardToolbarStore.state.settings.marking.textColor,
        type,
        angleRad,
    };
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
    const oppositeViewport = useGlobalViewport(
        id === "left" ? "right" : "left"
    );
    if (oppositeViewport === null) return;

    const delta = calculateDelta(e, params, oppositeViewport);
    calculatePreviousValues(params);
    oppositeViewport.emit("other-moved", e, delta);
};

export const handleOtherMove = (
    e: MovedEvent,
    params: ViewportHandlerParams,
    delta: Delta
) => {
    followLockedViewport(e, params, delta);
};

export const handleZoom = (e: ZoomedEvent, params: ViewportHandlerParams) => {
    // eslint-disable-next-line no-void
    void e;

    const { id, viewport } = params;
    const { setSize: setShallowViewportSize } =
        ShallowViewportStore(id).actions.size;

    setShallowViewportSize({
        screenWorldHeight: viewport.screenWorldHeight,
        screenWorldWidth: viewport.screenWorldWidth,
        worldHeight: viewport.worldHeight,
        worldWidth: viewport.worldWidth,
    });
};

let mousemoveCallback: (e: FederatedPointerEvent) => void;
export const handleMouseDown = (
    e: FederatedPointerEvent,
    params: ViewportHandlerParams
) => {
    const { id, viewport, store } = params;
    const cursorMode = DashboardToolbarStore.state.settings.cursor.mode;

    document.addEventListener(
        "cleanup",
        () => {
            MarkingsStore.actions.temporaryMarking.setTemporaryMarking(null);

            if (mousemoveCallback !== undefined) {
                viewport.removeEventListener("mousemove", mousemoveCallback);
            }
        },
        {
            once: true,
        }
    );

    if (cursorMode === "marking") {
        if (e.buttons !== 1) return;

        const markingType = DashboardToolbarStore.state.settings.marking.type;

        if (markingType === "point") {
            const updateTemporaryMarking = (ev: FederatedPointerEvent) => {
                const mousePos = getNormalizedMousePosition(ev, viewport);
                if (mousePos === undefined) return;

                const marking = createMarking(id, markingType, 0, mousePos);
                if (marking === null) return;

                MarkingsStore.actions.temporaryMarking.setTemporaryMarking(
                    marking
                );
            };

            mousemoveCallback = updateTemporaryMarking;
            updateTemporaryMarking(e);

            viewport.on("mousemove", updateTemporaryMarking);
        }

        if (markingType === "ray") {
            const updateTemporaryMarking = (ev: FederatedPointerEvent) => {
                const mousePos = getNormalizedMousePosition(ev, viewport);
                if (mousePos === undefined) return;
                store.actions.viewport.setRayAngleRad(
                    Math.atan2(
                        mousePos.y - store.state.rayPosition.y,
                        mousePos.x - store.state.rayPosition.x
                    ) -
                        Math.PI / 2
                );
                const marking = createMarking(
                    id,
                    markingType,
                    store.state.rayAngleRad,
                    store.state.rayPosition
                );
                if (marking === null) return;

                MarkingsStore.actions.temporaryMarking.setTemporaryMarking(
                    marking
                );
            };

            const mousePos = getNormalizedMousePosition(e, viewport);
            if (mousePos === undefined) return;

            store.actions.viewport.setRayPosition(mousePos);

            mousemoveCallback = updateTemporaryMarking;
            updateTemporaryMarking(e);

            viewport.on("mousemove", updateTemporaryMarking);
        }

        viewport.addEventListener("mouseleave", () => {
            document.dispatchEvent(new Event("cleanup"));
        });

        viewport.addEventListener("mouseout", () => {
            document.dispatchEvent(new Event("cleanup"));
        });
    }
};

export const handleMouseUp = (
    e: FederatedPointerEvent,
    params: ViewportHandlerParams
) => {
    const { id, viewport, store } = params;
    const cursorMode = DashboardToolbarStore.state.settings.cursor.mode;

    if (cursorMode !== "marking") return;
    if (e.button !== 0) return;
    if (MarkingsStore.state.temporaryMarking === null) return;

    const clickPos = getNormalizedMousePosition(e, viewport);
    if (clickPos === undefined) return;

    const markingType = DashboardToolbarStore.state.settings.marking.type;

    if (markingType === "point") {
        const marking = createMarking(id, markingType, 0, clickPos);
        if (marking === null) return;

        MarkingsStore.actions.temporaryMarking.setTemporaryMarking(null);
        MarkingsStore.actions.markings.addOne(marking);
    }

    if (markingType === "ray") {
        const marking = createMarking(
            id,
            markingType,
            store.state.rayAngleRad,
            store.state.rayPosition
        );
        if (marking === null) return;

        MarkingsStore.actions.temporaryMarking.setTemporaryMarking(null);
        MarkingsStore.actions.markings.addOne(marking);
    }

    if (mousemoveCallback !== undefined) {
        viewport.removeEventListener("mousemove", mousemoveCallback);
    }
};
