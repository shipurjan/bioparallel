import { FeedbackSetter } from "@/lib/types/types";
import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { SetStateInternal, makeImmerFeedbackSetter } from "../immer.helpers";
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

type Setters = {
    setInterfaceSettings: FeedbackSetter<Settings["interface"]>;
    setVideoSettings: FeedbackSetter<Settings["video"]>;
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

const SETTERS = (set: SetStateInternal<State>): Setters => ({
    setInterfaceSettings: makeImmerFeedbackSetter(set, state => [
        state.settings,
        "interface",
    ]),
    setVideoSettings: makeImmerFeedbackSetter(set, state => [
        state.settings,
        "video",
    ]),
});

const useStore = create<State & Setters>()(
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
    useStore as useGlobalSettingsStore,
    type State as GlobalSettingsState,
    type Settings as GlobalSettings,
};
