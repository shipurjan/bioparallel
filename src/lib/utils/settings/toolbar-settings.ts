/* eslint-disable no-param-reassign */
import { useGlobalToolbarStore } from "@/lib/stores/useToolbarStore";
import { produce } from "immer";

const setToolbarSettings = useGlobalToolbarStore.getState().set;

export const toggleLockedViewport = () =>
    setToolbarSettings(
        produce(settings => {
            settings.lockedViewport.state = !settings.lockedViewport.state;
        })
    );

export const toggleLockScaleSync = () => {
    setToolbarSettings(
        produce(settings => {
            settings.lockedViewport.options.scaleSync =
                !settings.lockedViewport.options.scaleSync;
        })
    );
};

export const enableSelectionCursorMode = () => {
    setToolbarSettings(
        produce(settings => {
            settings.cursorMode.state = "select";
        })
    );
};

export const enableMarkingCursorMode = () => {
    setToolbarSettings(
        produce(settings => {
            settings.cursorMode.state = "marking";
        })
    );
};
