import { FederatedPointerEvent } from "pixi.js";
import {
    CURSOR_MODES,
    DashboardToolbarStore,
} from "@/lib/stores/DashboardToolbar";
import { CUSTOM_GLOBAL_EVENTS, MOUSE_BUTTONS } from "@/lib/utils/const";
import { MARKING_TYPES } from "@/lib/stores/Markings";
import { getAngle } from "@/lib/utils/math/getAngle";
import {
    ViewportHandlerParams,
    addMarkingToStore,
    createMarking,
    getNormalizedMousePosition,
} from "./utils";

export const handleMouseDown = (
    e: FederatedPointerEvent,
    params: ViewportHandlerParams
) => {
    const { viewport, cachedViewportStore, markingsStore } = params;
    const { mode: cursorMode } = DashboardToolbarStore.state.settings.cursor;

    const { setTemporaryMarking, updateTemporaryMarking } =
        markingsStore.actions.temporaryMarking;

    const { temporaryMarking } = markingsStore.state;
    if (temporaryMarking !== null) return;

    let onMouseMove: (e: FederatedPointerEvent) => void = () => {};
    let onMouseUp: (e: FederatedPointerEvent) => void = () => {};
    let onMouseDown: (e: FederatedPointerEvent) => void = () => {};

    const interrupt = () => {
        setTemporaryMarking(null);
        viewport.removeEventListener("mousemove", onMouseMove);
        viewport.removeEventListener("mouseup", onMouseUp);
        viewport.removeEventListener("mousedown", onMouseDown);
    };
    document.addEventListener(
        CUSTOM_GLOBAL_EVENTS.INTERRUPT_MARKING,
        interrupt
    );

    if (cursorMode === CURSOR_MODES.MARKING) {
        if ((e.buttons as MOUSE_BUTTONS) !== MOUSE_BUTTONS.PRIMARY) return;

        const { type: markingType } =
            DashboardToolbarStore.state.settings.marking;

        switch (markingType) {
            case MARKING_TYPES.POINT: {
                setTemporaryMarking(
                    createMarking(
                        markingType,
                        null,
                        getNormalizedMousePosition(e, viewport)
                    )
                );

                onMouseMove = (e: FederatedPointerEvent) => {
                    updateTemporaryMarking({
                        position: getNormalizedMousePosition(e, viewport),
                    });
                };

                onMouseUp = () => {
                    viewport.removeEventListener("mousemove", onMouseMove);

                    const { temporaryMarking } = markingsStore.state;
                    if (temporaryMarking === null) return;

                    addMarkingToStore(temporaryMarking, params);

                    document.dispatchEvent(
                        new Event(CUSTOM_GLOBAL_EVENTS.INTERRUPT_MARKING)
                    );
                    document.removeEventListener(
                        CUSTOM_GLOBAL_EVENTS.INTERRUPT_MARKING,
                        interrupt
                    );
                };

                viewport.addEventListener("mousemove", onMouseMove);
                viewport.addEventListener("mouseup", onMouseUp, { once: true });
                break;
            }

            case MARKING_TYPES.RAY: {
                setTemporaryMarking(
                    createMarking(
                        markingType,
                        Math.PI,
                        getNormalizedMousePosition(e, viewport)
                    )
                );

                onMouseMove = (e: FederatedPointerEvent) => {
                    updateTemporaryMarking({
                        position: getNormalizedMousePosition(e, viewport),
                    });
                };

                onMouseUp = () => {
                    viewport.removeEventListener("mousemove", onMouseMove);

                    const { setRayPosition } =
                        cachedViewportStore.actions.viewport;
                    const mousePos = getNormalizedMousePosition(e, viewport);
                    setRayPosition(mousePos);

                    onMouseMove = (e: FederatedPointerEvent) => {
                        const mousePos = getNormalizedMousePosition(
                            e,
                            viewport
                        );
                        const { rayPosition } = cachedViewportStore.state;
                        updateTemporaryMarking({
                            angleRad: getAngle(mousePos, rayPosition),
                        });
                    };

                    onMouseDown = () => {
                        viewport.removeEventListener("mousemove", onMouseMove);

                        const { temporaryMarking } = markingsStore.state;
                        if (temporaryMarking === null) return;

                        addMarkingToStore(temporaryMarking, params);

                        document.dispatchEvent(
                            new Event(CUSTOM_GLOBAL_EVENTS.INTERRUPT_MARKING)
                        );
                        document.removeEventListener(
                            CUSTOM_GLOBAL_EVENTS.INTERRUPT_MARKING,
                            interrupt
                        );
                    };

                    viewport.addEventListener("mousemove", onMouseMove);
                    viewport.addEventListener("mousedown", onMouseDown, {
                        once: true,
                    });
                };

                viewport.addEventListener("mousemove", onMouseMove);
                viewport.addEventListener("mouseup", onMouseUp, { once: true });

                break;
            }
            default:
                throw new Error(markingType satisfies never);
        }
    }
};
