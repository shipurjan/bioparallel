import { FeedbackSetter } from "@/lib/types/types";
import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { SetStateInternal, makeImmerFeedbackSetter } from "../immer.helpers";
import { tauriStorage } from "../tauri-storage-adapter.helpers";

const STORE_NAME = "toolbar-settings";
const STORE_FILE = new Store(`${STORE_NAME}.dat`);

type Settings = {
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

type State = {
    settings: Settings;
};

type Setters = {
    setMarkingSettings: FeedbackSetter<Settings["marking"]>;
    setCursorModeSettings: FeedbackSetter<Settings["cursorMode"]>;
    setViewportSettings: FeedbackSetter<Settings["viewport"]>;
};

const INITIAL_STATE: State = {
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
};

const SETTERS = (set: SetStateInternal<State>): Setters => ({
    setCursorModeSettings: makeImmerFeedbackSetter(set, state => [
        state.settings,
        "cursorMode",
    ]),
    setMarkingSettings: makeImmerFeedbackSetter(set, state => [
        state.settings,
        "marking",
    ]),
    setViewportSettings: makeImmerFeedbackSetter(set, state => [
        state.settings,
        "viewport",
    ]),
});

const useDashboardToolbarStore = create<State & Setters>()(
    devtools(
        persist(
            set => ({
                ...INITIAL_STATE,
                ...SETTERS(set),
            }),
            {
                name: STORE_NAME,
                storage: createJSONStorage(() => tauriStorage(STORE_FILE)),
            }
        )
    )
);

export {
    useDashboardToolbarStore,
    type State as DashboardToolbarState,
    type Settings as DashboardToolbarSettings,
};
