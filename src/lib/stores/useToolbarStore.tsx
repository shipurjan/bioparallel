import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type GlobalToolbarSettings = {
    cursorMode: {
        state: "select" | "marking";
    };
    lockedViewport: {
        state: boolean;
        options: {
            scaleSync: boolean;
        };
    };
};

type GlobalToolbarSettingsState = {
    settings: GlobalToolbarSettings;
    set: (
        callback: (newSettings: GlobalToolbarSettings) => GlobalToolbarSettings
    ) => void;
};

export const useGlobalToolbarStore = create<GlobalToolbarSettingsState>()(
    devtools(set => ({
        settings: {
            cursorMode: {
                state: "select",
            },
            lockedViewport: {
                state: false,
                options: {
                    scaleSync: false,
                },
            },
        },
        set: callback => set(state => ({ settings: callback(state.settings) })),
    }))
);

export type ViewportToolbarSettings = {
    //
};
