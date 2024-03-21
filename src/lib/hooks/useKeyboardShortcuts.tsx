import { CURSOR_MODE, DashboardToolbarStore } from "../stores/DashboardToolbar";
import { MARKING_TYPE } from "../stores/Markings";
import { useKeyDown } from "./useKeyDown";

export const useKeyboardShortcuts = () => {
    const cursorMode = DashboardToolbarStore.use(
        state => state.settings.cursor.mode
    );

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
        setCursorMode(CURSOR_MODE.SELECTION);
    }, ["F1"]);

    useKeyDown(() => {
        setCursorMode(CURSOR_MODE.MARKING);
    }, ["F2"]);

    useKeyDown(() => {
        if (cursorMode === CURSOR_MODE.MARKING) {
            setMarkingType(MARKING_TYPE.POINT);
        }
    }, ["1"]);

    useKeyDown(() => {
        if (cursorMode === CURSOR_MODE.MARKING) {
            setMarkingType(MARKING_TYPE.RAY);
        }
    }, ["2"]);

    useKeyDown(() => {
        toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        toggleLockScaleSync();
    }, ["m"]);
};
