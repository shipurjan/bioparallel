import { FederatedPointerEvent } from "pixi.js";
import {
    CURSOR_MODES,
    DashboardToolbarStore,
} from "@/lib/stores/DashboardToolbar";
import { CUSTOM_GLOBAL_EVENTS, MOUSE_BUTTONS } from "@/lib/utils/const";
import { Marking, MARKING_TYPES } from "@/lib/stores/Markings";
import { getAngle } from "@/lib/utils/math/getAngle";
import {
    ViewportHandlerParams,
    addMarkingToStore,
    createMarking,
    getNormalizedMousePosition,
} from "./utils";

function setTemporaryMarkingToEitherNewOrExisting(
    newMarking: Marking | null,
    params: ViewportHandlerParams
) {
    const { markingsStore } = params;
    const { getMarkingAtCursor } = markingsStore.actions.cursor;
    const { editOneById: editMarkingById } = markingsStore.actions.markings;
    const { setTemporaryMarking } = markingsStore.actions.temporaryMarking;

    const isCursorFinite = markingsStore.actions.cursor.isFinite();
    const markingToEdit = getMarkingAtCursor();

    if (isCursorFinite && markingToEdit) {
        editMarkingById(markingToEdit.id, { hidden: true });
    }

    setTemporaryMarking(newMarking);
}

export const handleMouseDown = (
    e: FederatedPointerEvent,
    params: ViewportHandlerParams
) => {
    const { viewport, cachedViewportStore, markingsStore } = params;

    if (viewport.children.length < 1) return;

    const { mode: cursorMode } = DashboardToolbarStore.state.settings.cursor;

    const { setTemporaryMarking, updateTemporaryMarking } =
        markingsStore.actions.temporaryMarking;

    const { temporaryMarking } = markingsStore.state;
    if (temporaryMarking !== null) return;

    let onMouseMove: (e: FederatedPointerEvent) => void = () => {};
    let onMouseUp: (e: FederatedPointerEvent) => void = () => {};
    let onMouseDown: (e: FederatedPointerEvent) => void = () => {};

    const interrupt = () => {
        const { temporaryMarking } = markingsStore.state;
        if (temporaryMarking) {
            const marking = markingsStore.state.markings.find(
                m => m.id === temporaryMarking.id
            );
            if (marking) {
                markingsStore.actions.markings.editOneById(marking.id, {
                    hidden: false,
                });
            }
        }

        setTemporaryMarking(null, { revertGeneratorId: true });
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

        const id = markingsStore.state.temporaryMarking?.id;

        switch (markingType) {
            case MARKING_TYPES.POINT: {
                setTemporaryMarkingToEitherNewOrExisting(
                    createMarking(
                        id,
                        markingType,
                        null,
                        getNormalizedMousePosition(e, viewport)
                    ),
                    params
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

                    const isCursorFinite =
                        markingsStore.actions.cursor.isFinite();

                    if (!isCursorFinite) {
                        addMarkingToStore(temporaryMarking, params);
                    } else {
                        const markingToEdit =
                            markingsStore.actions.cursor.getMarkingAtCursor();

                        if (!markingToEdit) return;

                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { id, selected, ...newProps } = temporaryMarking;

                        markingsStore.actions.markings.editOneById(
                            markingToEdit.id,
                            newProps
                        );
                    }

                    setTemporaryMarking(null);
                    viewport.removeEventListener("mousemove", onMouseMove);
                    viewport.removeEventListener("mouseup", onMouseUp);
                    viewport.removeEventListener("mousedown", onMouseDown);
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
                setTemporaryMarkingToEitherNewOrExisting(
                    createMarking(
                        id,
                        markingType,
                        null,
                        getNormalizedMousePosition(e, viewport)
                    ),
                    params
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

                        const { temporaryMarking, cursor } =
                            markingsStore.state;
                        if (temporaryMarking === null) return;

                        if (cursor.rowIndex === Infinity) {
                            addMarkingToStore(temporaryMarking, params);
                        } else {
                            const markingToEdit =
                                markingsStore.actions.cursor.getMarkingAtCursor();

                            if (!markingToEdit) return;

                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { id, selected, ...newProps } =
                                temporaryMarking;

                            markingsStore.actions.markings.editOneById(
                                markingToEdit.id,
                                newProps
                            );
                        }

                        setTemporaryMarking(null);
                        viewport.removeEventListener("mousemove", onMouseMove);
                        viewport.removeEventListener("mouseup", onMouseUp);
                        viewport.removeEventListener("mousedown", onMouseDown);
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
