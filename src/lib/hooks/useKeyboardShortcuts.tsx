import { DashboardToolbarStore } from "../stores/DashboardToolbar";
import { useKeyDown } from "./useKeyDown";

export const useKeyboardShortcuts = () => {
    const { actions } = DashboardToolbarStore;
    const { cursor: cursorActions, viewport: viewportActions } =
        actions.settings;

    const { setCursorMode } = cursorActions;
    const { toggleLockedViewport, toggleLockScaleSync } = viewportActions;

    useKeyDown(() => {
        setCursorMode("select");
    }, ["1"]);

    useKeyDown(() => {
        setCursorMode("marking");
    }, ["2"]);

    useKeyDown(() => {
        toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        toggleLockScaleSync();
    }, ["m"]);
};
