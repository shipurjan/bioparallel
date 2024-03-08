/* eslint-disable no-param-reassign */

import { makeImmerSetter } from "../immer.helpers";
import { GlobalSettings, useGlobalSettingsStore } from "./GlobalSettings.store";

const setInterfaceSettings = makeImmerSetter(
    useGlobalSettingsStore.getState().setInterfaceSettings
);

const setVideoSettings = makeImmerSetter(
    useGlobalSettingsStore.getState().setVideoSettings
);

class StoreClass {
    readonly actions = {
        settings: {
            interface: {
                setTheme(newTheme: GlobalSettings["interface"]["theme"]) {
                    setInterfaceSettings(settings => {
                        settings.theme = newTheme;
                    });
                },
            },
            video: {
                setPrerenderRadius(
                    newRadius: GlobalSettings["video"]["rendering"]["prerenderRadius"]
                ) {
                    setVideoSettings(settings => {
                        settings.rendering.prerenderRadius = newRadius;
                    });
                },
            },
        },
    };

    get state() {
        return useGlobalSettingsStore.getState();
    }

    readonly use = useGlobalSettingsStore;
}

const Store = new StoreClass();
export { Store as GlobalSettingsStore };
