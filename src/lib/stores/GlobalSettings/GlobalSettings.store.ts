import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Immer, produceCallback } from "../immer.helpers";
import { tauriStorage } from "../tauri-storage-adapter.helpers";

const STORE_NAME = "global-settings";
const STORE_FILE = new Store(`${STORE_NAME}.dat`);

type Settings = {
    interface: {
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

type State = {
    settings: Settings;
};

const INITIAL_STATE: State = {
    settings: {
        interface: {
            theme: "system",
        },
        video: {
            rendering: {
                prerenderRadius: "auto",
            },
        },
    },
};

const useStore = create<Immer<State>>()(
    persist(
        devtools(set => ({
            ...INITIAL_STATE,
            set: callback => set(produceCallback(callback)),
        })),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => tauriStorage(STORE_FILE)),
        }
    )
);

export {
    useStore as useGlobalSettingsStore,
    type State as GlobalSettingsState,
};
