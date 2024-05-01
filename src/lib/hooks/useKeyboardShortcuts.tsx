import {
    CURSOR_MODES,
    DashboardToolbarStore,
} from "../stores/DashboardToolbar";
import { MARKING_TYPES } from "../stores/Markings";
import { useKeyDown } from "./useKeyDown";

export const useKeyboardShortcuts = () => {
    const { actions } = DashboardToolbarStore;
    const {
        cursor: cursorActions,
        marking: markingActions,
        viewport: viewportActions,
    } = actions.settings;

    const { setMarkingType } = markingActions;
    const { setCursorMode } = cursorActions;
    const { toggleLockedViewport, toggleLockScaleSync } = viewportActions;

    useKeyDown(() => {
        setCursorMode(CURSOR_MODES.SELECTION);
    }, ["F1"]);

    useKeyDown(() => {
        setCursorMode(CURSOR_MODES.MARKING);
    }, ["F2"]);

    useKeyDown(() => {
        setMarkingType(MARKING_TYPES.POINT);
    }, ["1"]);

    useKeyDown(() => {
        setMarkingType(MARKING_TYPES.RAY);
    }, ["2"]);

    useKeyDown(() => {
        toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        toggleLockScaleSync();
    }, ["m"]);
};
