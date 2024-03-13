/* eslint-disable no-underscore-dangle */
import { DashboardToolbarStore } from "@/lib/stores/DashboardToolbar";
import { MovedEvent } from "pixi-viewport/dist/types";
import { FederatedPointerEvent } from "pixi.js";
import { Viewport as PixiViewport } from "pixi-viewport";
import { round } from "@/lib/utils/math/round";
import { ShallowViewportStore } from "@/lib/stores/ShallowViewport";
import { Marking, MarkingsStore } from "@/lib/stores/Markings";
import { getNormalizedPosition } from "../overlays/utils/get-viewport-local-position";
import { useGlobalViewport } from "./hooks/useGlobalViewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";

type Position = {
    x: number;
    y: number;
};
type ZoomValue = number;
type Zoom = {
    value: ZoomValue;
    offset: Position;
};
type Delta = Zoom | Position | null;

let PREV_SCALED: ZoomValue = 1;
let PREV_POSITION: Position = { x: 0, y: 0 };
let PREV_OTHER_SCALED: ZoomValue = 1;
let RAY_POSITION: Position = { x: 0, y: 0 };
let RAY_ANGLE_RAD: number = 0;

function calculatePreviousValues(viewport: PixiViewport) {
    PREV_SCALED = viewport.scaled;
    PREV_POSITION = {
        x: viewport.position._x,
        y: viewport.position._y,
    };
}

function getNormalizedMousePosition(
    event: FederatedPointerEvent,
    viewport: PixiViewport
): Position {
    return getNormalizedPosition(viewport, {
        x: event.screenX,
        y: event.screenY,
    });
}

function calculateDelta(
    e: MovedEvent,
    viewport: PixiViewport,
    oppositeViewport: PixiViewport
): Delta {
    switch (e.type) {
        case "drag": {
            const isScaleSync =
                DashboardToolbarStore.state.settings.viewport.scaleSync;
            return {
                x:
                    (viewport.position._x - PREV_POSITION.x) /
                    (isScaleSync ? viewport.scaled : oppositeViewport.scaled),
                y:
                    (viewport.position._y - PREV_POSITION.y) /
                    (isScaleSync ? viewport.scaled : oppositeViewport.scaled),
            };
        }
        case "wheel": {
            return {
                value: viewport.scaled / PREV_SCALED,
                offset: {
                    x:
                        (viewport.position._x - PREV_POSITION.x) /
                        viewport.scaled,
                    y:
                        (viewport.position._y - PREV_POSITION.y) /
                        viewport.scaled,
                },
            };
        }
        default:
            return null;
    }
}

function followLockedViewport(
    viewport: PixiViewport,
    event: MovedEvent,
    delta: Delta,
    updateViewport: () => void
) {
    switch (event.type) {
        case "drag": {
            const { x, y } = delta as Position;
            viewport.moveCorner(viewport.corner.x - x, viewport.corner.y - y);
            break;
        }
        case "wheel": {
            const {
                value,
                offset: { x, y },
            } = delta as Zoom;

            const oldScale = viewport.scaled;
            const newScale = round(oldScale * value, 3);

            if (newScale !== PREV_OTHER_SCALED) {
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

            PREV_OTHER_SCALED = newScale;
            break;
        }
        default:
            break;
    }

    updateViewport();
    calculatePreviousValues(viewport);
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

export const handleMove = (
    e: MovedEvent,
    viewport: PixiViewport,
    id: CanvasMetadata["id"],
    updateViewport: () => void
) => {
    updateViewport();
    calculatePreviousValues(viewport);

    const isLocked = DashboardToolbarStore.state.settings.viewport.locked;

    if (!isLocked) return;

    // Jeśli Viewport jest zalockowany (L): wyślij eventy do drugiego viewportu

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const oppositeViewport = useGlobalViewport(
        id === "left" ? "right" : "left"
    );
    if (oppositeViewport === null) return;

    const delta = calculateDelta(e, viewport, oppositeViewport);
    oppositeViewport.emit("other-moved", e, delta);
};

export const handleOtherMove = (
    e: MovedEvent,
    delta: Delta,
    viewport: PixiViewport,
    updateViewport: () => void
) => {
    followLockedViewport(viewport, e, delta, updateViewport);
};

export const handleZoom = (
    id: CanvasMetadata["id"],
    viewport: PixiViewport
) => {
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
    id: CanvasMetadata["id"],
    viewport: PixiViewport
) => {
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
                RAY_ANGLE_RAD =
                    Math.atan2(
                        mousePos.y - RAY_POSITION.y,
                        mousePos.x - RAY_POSITION.x
                    ) -
                    Math.PI / 2;
                const marking = createMarking(
                    id,
                    markingType,
                    RAY_ANGLE_RAD,
                    RAY_POSITION
                );
                if (marking === null) return;

                MarkingsStore.actions.temporaryMarking.setTemporaryMarking(
                    marking
                );
            };

            const mousePos = getNormalizedMousePosition(e, viewport);
            if (mousePos === undefined) return;

            RAY_POSITION = mousePos;

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
    id: CanvasMetadata["id"],
    viewport: PixiViewport
) => {
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
            RAY_ANGLE_RAD,
            RAY_POSITION
        );
        if (marking === null) return;

        MarkingsStore.actions.temporaryMarking.setTemporaryMarking(null);
        MarkingsStore.actions.markings.addOne(marking);
    }

    if (mousemoveCallback !== undefined) {
        viewport.removeEventListener("mousemove", mousemoveCallback);
    }
};
