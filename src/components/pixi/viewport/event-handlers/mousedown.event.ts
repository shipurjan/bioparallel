import { FederatedPointerEvent } from "pixi.js";
import {
    CURSOR_MODES,
    DashboardToolbarStore,
} from "@/lib/stores/DashboardToolbar";
import { MOUSE_BUTTONS } from "@/lib/utils/const";
import { MARKING_TYPES, MarkingsStore } from "@/lib/stores/Markings";
import {
    ViewportHandlerParams,
    createMarking,
    getNormalizedMousePosition,
} from "./utils";

export const handleMouseDown = (
    e: FederatedPointerEvent,
    params: ViewportHandlerParams
) => {
    const { id, viewport, store } = params;
    const cursorMode = DashboardToolbarStore.state.settings.cursor.mode;

    if (cursorMode === CURSOR_MODES.MARKING) {
        if (e.buttons !== MOUSE_BUTTONS.PRIMARY) return;

        const markingType = DashboardToolbarStore.state.settings.marking.type;

        switch (markingType) {
            case MARKING_TYPES.POINT: {
                const updateTemporaryMarking = (ev: FederatedPointerEvent) => {
                    const mousePos = getNormalizedMousePosition(ev, viewport);
                    if (mousePos === undefined) return;

                    const marking = createMarking(markingType, null, mousePos);
                    if (marking === null) return;

                    MarkingsStore(
                        id
                    ).actions.temporaryMarking.setTemporaryMarking(marking);
                };

                updateTemporaryMarking(e);

                viewport.on("mousemove", updateTemporaryMarking);
                break;
            }

            case MARKING_TYPES.RAY: {
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
                        markingType,
                        store.state.rayAngleRad,
                        store.state.rayPosition
                    );
                    if (marking === null) return;

                    MarkingsStore(
                        id
                    ).actions.temporaryMarking.setTemporaryMarking(marking);
                };

                const mousePos = getNormalizedMousePosition(e, viewport);
                if (mousePos === undefined) return;

                store.actions.viewport.setRayPosition(mousePos);
                updateTemporaryMarking(e);

                viewport.on("mousemove", updateTemporaryMarking);
                break;
            }

            default:
                throw new Error(`Invalid marking type: ${markingType}`);
        }
    }
};

// export const handleMouseUp = (
//     e: FederatedPointerEvent,
//     params: ViewportHandlerParams
// ) => {
//     const { id, viewport, store } = params;

//     viewport.off("mousemove", updateTemporaryMarking);

//     const cursorMode = DashboardToolbarStore.state.settings.cursor.mode;

//     if (cursorMode === CURSOR_MODES.MARKING) {
//         if (e.button !== MOUSE_BUTTON.PRIMARY) return;

//         const markingType = DashboardToolbarStore.state.settings.marking.type;

//         switch (markingType) {
//             case MARKING_TYPES.POINT: {
//                 const position =
//                     MarkingsStore(id).state.temporaryMarking?.position;
//                 if (position === undefined) return;

//                 const markingType =
//                     DashboardToolbarStore.state.settings.marking.type;
//                 addMarkingToStore(store, id, markingType, position);
//                 break;
//             }
//             case MARKING_TYPES.RAY: {
//                 break;
//             }
//             default:
//                 throw new Error(`Invalid marking type: ${markingType}`);
//         }
//     }
// };

// export const handleMouseLeave = (
//     e: FederatedPointerEvent,
//     params: ViewportHandlerParams
// ) => {
//     // eslint-disable-next-line no-void
//     void { e, params };
// };
