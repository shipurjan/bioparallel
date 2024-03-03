/* eslint-disable no-param-reassign */
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Store } from "tauri-plugin-store-api";
import { produce } from "immer";
import { tauriStorage } from "./zustand-tauri-store-adapter";

const settingsStore = new Store("global-settings.dat");

export type GlobalSettings = {
    design: {
        theme: "system" | "light" | "dark";
    };
    video: {
        rendering: {
            prerenderRadius:
                | "auto"
                | "none"
                | "low"
                | "medium"
                | "high"
                | "very high";
        };
    };
};

type GlobalSettingsState = {
    settings: GlobalSettings;
    setInterfaceSettings: (
        callback: (
            newSettings: GlobalSettings["design"]
        ) => GlobalSettings["design"]
    ) => void;
    setVideoSettings: (
        callback: (
            newSettings: GlobalSettings["video"]
        ) => GlobalSettings["video"]
    ) => void;
};

export const useGlobalSettingsStore = create<GlobalSettingsState>()(
    devtools(
        persist(
            set => ({
                settings: {
                    design: {
                        theme: "system",
                    },
                    video: {
                        rendering: {
                            prerenderRadius: "auto",
                        },
                    },
                },
                setInterfaceSettings: callback =>
                    set(
                        produce((state: GlobalSettingsState) => {
                            state.settings.design = callback(
                                state.settings.design
                            );
                        })
                    ),
                setVideoSettings: callback =>
                    set(
                        produce((state: GlobalSettingsState) => {
                            state.settings.video = callback(
                                state.settings.video
                            );
                        })
                    ),
            }),
            {
                name: "global-settings",
                storage: createJSONStorage(() => tauriStorage(settingsStore)),
            }
        )
    )
);

class GlobalClass {
    // helper getter dla komponentów nie-Reactowych;
    // dla komponentów React używaj useGlobalToolbarStore
    get settings() {
        return useGlobalSettingsStore.getState().settings;
    }

    setTheme(theme: GlobalSettings["design"]["theme"]) {
        useGlobalSettingsStore.getState().setInterfaceSettings(
            produce(settings => {
                settings.theme = theme;
            })
        );
    }

    setPrerenderRadius(
        prerenderRadius: GlobalSettings["video"]["rendering"]["prerenderRadius"]
    ) {
        useGlobalSettingsStore.getState().setVideoSettings(
            produce(settings => {
                settings.rendering.prerenderRadius = prerenderRadius;
            })
        );
    }
}

export const Global = new GlobalClass();
