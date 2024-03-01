import { useKeyDown } from "./useKeyDown";
import {
    enableMarkingCursorMode,
    enableSelectionCursorMode,
    toggleLockScaleSync,
    toggleLockedViewport,
} from "../utils/settings/toolbar-settings";

export const useKeyboardShortcuts = () => {
    useKeyDown(() => {
        enableSelectionCursorMode();
    }, ["1"]);

    useKeyDown(() => {
        enableMarkingCursorMode();
    }, ["2"]);

    useKeyDown(() => {
        toggleLockedViewport();
    }, ["l"]);

    useKeyDown(() => {
        toggleLockScaleSync();
    }, ["m"]);
};
