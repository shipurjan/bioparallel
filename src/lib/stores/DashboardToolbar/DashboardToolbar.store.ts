import { Store } from "@tauri-apps/plugin-store";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Immer, produceCallback } from "../immer.helpers";
import { tauriStorage } from "../tauri-storage-adapter.helpers";
import { MARKING_TYPE, Marking } from "../Markings";

const STORE_NAME = "toolbar-settings";
const STORE_FILE = new Store(`${STORE_NAME}.dat`);

export const enum CURSOR_MODE {
    SELECTION = "selection",
    MARKING = "marking",
}

type Settings = {
    cursor: {
        mode: CURSOR_MODE;
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
            mode: CURSOR_MODE.SELECTION,
        },
        marking: {
            type: MARKING_TYPE.POINT,
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
