import { DashboardToolbarStore } from "../stores/DashboardToolbar";
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
        setCursorMode("select");
    }, ["F1"]);

    useKeyDown(() => {
        setCursorMode("marking");
    }, ["F2"]);

    useKeyDown(() => {
        if (cursorMode === "marking") {
            setMarkingType("point");
        }
    }, ["1"]);

    useKeyDown(() => {
        if (cursorMode === "marking") {
            setMarkingType("ray");
        }
    }, ["2"]);

    useKeyDown(() => {
        toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        toggleLockScaleSync();
    }, ["m"]);
};
