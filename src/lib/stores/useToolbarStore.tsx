/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type GlobalToolbarSettings = {
    cursorMode: {
        state: "select" | "marking";
    };
    marking: {
        backgroundColor: string;
        textColor: string;
        size: number;
    };
    viewport: {
        locked: boolean;
        scaleSync: boolean;
    };
};

type GlobalToolbarSettingsState = {
    settings: GlobalToolbarSettings;
    setMarkingSettings: (
        callback: (
            newSettings: GlobalToolbarSettings["marking"]
        ) => GlobalToolbarSettings["marking"]
    ) => void;
    setCursorModeSettings: (
        callback: (
            newSettings: GlobalToolbarSettings["cursorMode"]
        ) => GlobalToolbarSettings["cursorMode"]
    ) => void;
    setViewportSettings: (
        callback: (
            newSettings: GlobalToolbarSettings["viewport"]
        ) => GlobalToolbarSettings["viewport"]
    ) => void;
};

export const useGlobalToolbarStore = create<GlobalToolbarSettingsState>()(
    devtools(set => ({
        settings: {
            cursorMode: {
                state: "select",
            },
            marking: {
                backgroundColor: "#ff0000",
                textColor: "#000000",
                size: 8,
            },
            viewport: {
                locked: false,
                scaleSync: false,
            },
        },
        setCursorModeSettings: callback =>
            set(
                produce((state: GlobalToolbarSettingsState) => {
                    state.settings.cursorMode = callback(
                        state.settings.cursorMode
                    );
                })
            ),
        setMarkingSettings: callback =>
            set(
                produce((state: GlobalToolbarSettingsState) => {
                    state.settings.marking = callback(state.settings.marking);
                })
            ),
        setViewportSettings: callback =>
            set(
                produce((state: GlobalToolbarSettingsState) => {
                    state.settings.viewport = callback(state.settings.viewport);
                })
            ),
    }))
);

class ToolbarClass {
    // helper getter dla komponentów nie-React;
    // dla komponentów React używaj useGlobalToolbarStore
    get settings() {
        return useGlobalToolbarStore.getState().settings;
    }

    toggleLockedViewport() {
        useGlobalToolbarStore.getState().setViewportSettings(
            produce(settings => {
                settings.locked = !settings.locked;
            })
        );
    }

    toggleLockScaleSync() {
        useGlobalToolbarStore.getState().setViewportSettings(
            produce(settings => {
                settings.scaleSync = !settings.scaleSync;
            })
        );
    }

    setCursorMode(mode: GlobalToolbarSettings["cursorMode"]["state"]) {
        useGlobalToolbarStore.getState().setCursorModeSettings(
            produce(settings => {
                settings.state = mode;
            })
        );
    }

    setMarkingBackgroundColor(color: string) {
        console.log("setting");
        useGlobalToolbarStore.getState().setMarkingSettings(
            produce(settings => {
                settings.backgroundColor = color;
            })
        );
    }

    setMarkingTextColor(color: string) {
        useGlobalToolbarStore.getState().setMarkingSettings(
            produce(settings => {
                settings.textColor = color;
            })
        );
    }
}

export const Toolbar = new ToolbarClass();
