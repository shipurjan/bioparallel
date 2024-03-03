/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { tauriStorage } from "./zustand-tauri-store-adapter";

const toolbarStore = new Store("toolbar-settings.dat");

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
    devtools(
        persist(
            set => ({
                settings: {
                    cursorMode: {
                        state: "select",
                    },
                    marking: {
                        backgroundColor: "#61bd67",
                        textColor: "#0a130a",
                        size: 10,
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
                            state.settings.marking = callback(
                                state.settings.marking
                            );
                        })
                    ),
                setViewportSettings: callback =>
                    set(
                        produce((state: GlobalToolbarSettingsState) => {
                            state.settings.viewport = callback(
                                state.settings.viewport
                            );
                        })
                    ),
            }),
            {
                name: "toolbar-settings",
                storage: createJSONStorage(() => tauriStorage(toolbarStore)),
            }
        )
    )
);

class ToolbarClass {
    // helper getter dla komponentów nie-Reactowych;
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
        useGlobalToolbarStore.getState().setMarkingSettings(
            produce(settings => {
                settings.backgroundColor = color;
            })
        );
    }

    setMarkingSize(size: number) {
        useGlobalToolbarStore.getState().setMarkingSettings(
            produce(settings => {
                settings.size = size;
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
