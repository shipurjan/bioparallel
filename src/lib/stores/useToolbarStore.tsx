import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type GlobalToolbarSettings = {
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
