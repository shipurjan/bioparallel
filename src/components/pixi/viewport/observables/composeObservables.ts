import { Viewport } from "pixi-viewport";
import { ViewportHandlerParams } from "../event-handlers/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { keyDown as _keyDown } from "./events/key";

// function setTemporaryMarkingToEitherNewOrExisting(
//     newMarking: Marking | null,
//     params: ViewportHandlerParams
// ) {
//     const { markingsStore } = params;
//     const { getMarkingAtCursor } = markingsStore.actions.cursor;
//     const { editOneById: editMarkingById } = markingsStore.actions.markings;
//     const { setTemporaryMarking } = markingsStore.actions.temporaryMarking;

//     const isCursorFinite = markingsStore.actions.cursor.isFinite();
//     const markingToEdit = getMarkingAtCursor();

//     if (isCursorFinite && markingToEdit) {
//         editMarkingById(markingToEdit.id, { hidden: true });
//     }

//     setTemporaryMarking(newMarking);
// }

export function composeObservables(
    viewport: Viewport,
    params: ViewportHandlerParams
) {
    // eslint-disable-next-line no-unused-expressions, no-void
    void { viewport, params };
    // const { markingsStore } = params;
    // const { setTemporaryMarking, updateTemporaryMarking } =
    //     markingsStore.actions.temporaryMarking;
    //
    // const interrupt = () => {
    //     const { temporaryMarking } = markingsStore.state;
    //     if (temporaryMarking) {
    //         const marking = markingsStore.state.markings.find(
    //             m => m.id === temporaryMarking.id
    //         );
    //         if (marking) {
    //             markingsStore.actions.markings.editOneById(marking.id, {
    //                 hidden: false,
    //             });
    //         }
    //     }
    //
    //     setTemporaryMarking(null, { revertGeneratorId: true });
    // };
    //
    // const escapeKey = keyName(_keyDown, "Escape");
    //
    // const mouseDown = primaryButton(mouseEvent(viewport, "mousedown"), true);
    // const mouseUp = primaryButton(mouseEvent(viewport, "mouseup"), false);
    // const mouseMove = mouseEvent(viewport, "mousemove");
    //
    // const interruptEvent = fromEvent(document, "interrupt");
    //
    // const mouseUpSubscription = mouseUp.subscribe(() => {
    //     console.log("uwu");
    // });
    //
    // const addMarking = () => {
    //     const { type: markingType } =
    //         DashboardToolbarStore.state.settings.marking;
    //
    //     const id = markingsStore.state.temporaryMarking?.id;
    //
    //     setTemporaryMarkingToEitherNewOrExisting(
    //         createMarking(
    //             id,
    //             markingType,
    //             null,
    //             getNormalizedMousePosition(e, viewport)
    //         ),
    //         params
    //     );
    // };
    //
    // const mouseDownSubscription = mouseDown.subscribe(() => {});
    //
    // interruptEvent.subscribe(() => {
    //     console.log("interrupted");
    //     interrupt();
    // });
}
