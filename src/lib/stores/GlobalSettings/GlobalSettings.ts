/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { ActionProduceCallback } from "../immer.helpers";
import {
    GlobalSettingsState as State,
    useGlobalSettingsStore as useStore,
} from "./GlobalSettings.store";

const storeState = useStore.getState();

class StoreClass {
    private setInterfaceSettings(
        callback: ActionProduceCallback<State["settings"]["interface"], State>
    ) {
        storeState.set(draft => {
            draft.settings.interface = callback(
                draft.settings.interface,
                draft
            );
        });
    }

    private setVideoSettings(
        callback: ActionProduceCallback<State["settings"]["video"], State>
    ) {
        storeState.set(draft => {
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

    get state() {
        return useStore.getState();
    }

    readonly use = useStore;
}

const Store = new StoreClass();
export { Store as GlobalSettingsStore };
