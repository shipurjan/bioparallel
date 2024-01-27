import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Store } from "tauri-plugin-store-api";
import { tauriStorage } from "./zustand-tauri-store-adapter";

const settingsStore = new Store("settings.dat");

export const DEFAULT_THEME = "system";

export type Settings = {
    theme: string;
};

type SettingsState = {
    settings: Settings;
    set: (callback: (newSettings: Settings) => Settings) => void;
};

export const useSettingsStore = create<SettingsState>()(
    devtools(
        persist(
            set => ({
                settings: {
                    theme: DEFAULT_THEME,
                },
                set: callback =>
                    set(state => ({ settings: callback(state.settings) })),
            }),
            {
                name: "settings-store",
                storage: createJSONStorage(() => tauriStorage(settingsStore)),
            }
        )
    )
);
