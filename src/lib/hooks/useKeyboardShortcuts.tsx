import { Toolbar, useGlobalToolbarStore } from "../stores/useToolbarStore";
import { useKeyDown } from "./useKeyDown";

export const useKeyboardShortcuts = () => {
    useGlobalToolbarStore(state => state.settings);

    useKeyDown(() => {
        Toolbar.setCursorMode("select");
    }, ["1"]);

    useKeyDown(() => {
        Toolbar.setCursorMode("marking");
    }, ["2"]);

    useKeyDown(() => {
        Toolbar.toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        Toolbar.toggleLockScaleSync();
    }, ["m"]);
};
