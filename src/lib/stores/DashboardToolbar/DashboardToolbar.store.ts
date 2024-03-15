import { Store } from "@tauri-apps/plugin-store";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Immer, produceCallback } from "../immer.helpers";
import { tauriStorage } from "../tauri-storage-adapter.helpers";
import { Marking } from "../Markings";

const STORE_NAME = "toolbar-settings";
const STORE_FILE = new Store(`${STORE_NAME}.dat`);

type Settings = {
    cursor: {
        mode: "select" | "marking";
    };
    marking: {
        type: Marking["type"];
        backgroundColor: string;
        textColor: string;
        size: number;
    };
    viewport: {
        locked: boolean;
        scaleSync: boolean;
    };
};

type State = {
    settings: Settings;
};

const INITIAL_STATE: State = {
    settings: {
        cursor: {
            mode: "select",
        },
        marking: {
            type: "point",
            backgroundColor: "#61bd67",
            textColor: "#0a130a",
            size: 10,
        },
        viewport: {
            locked: false,
            scaleSync: false,
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
    useStore as _useDashboardToolbarStore,
    type State as DashboardToolbarState,
};
