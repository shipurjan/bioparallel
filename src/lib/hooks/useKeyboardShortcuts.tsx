import { DashboardToolbarStore } from "../stores/DashboardToolbar";
import { useKeyDown } from "./useKeyDown";

export const useKeyboardShortcuts = () => {
    useKeyDown(() => {
        DashboardToolbarStore.actions.settings.cursorMode.setCursorMode(
            "select"
        );
    }, ["1"]);

    useKeyDown(() => {
        DashboardToolbarStore.actions.settings.cursorMode.setCursorMode(
            "marking"
        );
    }, ["2"]);

    useKeyDown(() => {
        DashboardToolbarStore.actions.settings.viewport.toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        DashboardToolbarStore.actions.settings.viewport.toggleLockScaleSync();
    }, ["m"]);
};
