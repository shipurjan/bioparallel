/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { ActionProduceCallback } from "../immer.helpers";
import {
    GlobalSettingsState as State,
    _useGlobalSettingsStore as useStore,
} from "./GlobalSettings.store";

class StoreClass {
    readonly use = useStore;

    get state() {
        return useStore.getState();
    }

    private setInterfaceSettings(
        callback: ActionProduceCallback<State["settings"]["interface"], State>
    ) {
        this.state.set(draft => {
            draft.settings.interface = callback(
                draft.settings.interface,
                draft
            );
        });
    }

    private setVideoSettings(
        callback: ActionProduceCallback<State["settings"]["video"], State>
    ) {
        this.state.set(draft => {
            draft.settings.video = callback(draft.settings.video, draft);
        });
    }

    readonly actions = {
        settings: {
            interface: {
                setTheme: (
                    newTheme: State["settings"]["interface"]["theme"]
                ) => {
                    this.setInterfaceSettings(
                        produce(settings => {
                            settings.theme = newTheme;
                        })
                    );
                },
            },
            video: {
                setPrerenderRadius: (
                    newRadius: State["settings"]["video"]["rendering"]["prerenderRadius"]
                ) => {
                    this.setVideoSettings(
                        produce(settings => {
                            settings.rendering.prerenderRadius = newRadius;
                        })
                    );
                },
            },
        },
    };
}

const Store = new StoreClass();
export { Store as GlobalSettingsStore };
export { StoreClass as GlobalSettingsStoreClass };
