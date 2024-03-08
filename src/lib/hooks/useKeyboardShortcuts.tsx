import { DashboardToolbar } from "../stores/DashboardToolbar";
import { useKeyDown } from "./useKeyDown";

export const useKeyboardShortcuts = () => {
    useKeyDown(() => {
        DashboardToolbar.actions.settings.cursorMode.setCursorMode("select");
    }, ["1"]);

    useKeyDown(() => {
        DashboardToolbar.actions.settings.cursorMode.setCursorMode("marking");
    }, ["2"]);

    useKeyDown(() => {
        DashboardToolbar.actions.settings.viewport.toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        DashboardToolbar.actions.settings.viewport.toggleLockScaleSync();
    }, ["m"]);
};
