/* eslint-disable no-param-reassign */

import { makeImmerSetter } from "../immer.helpers";
import {
    DashboardToolbarSettings,
    useDashboardToolbarStore,
} from "./DashboardToolbar.store";

const setViewportSettings = makeImmerSetter(
    useDashboardToolbarStore.getState().setViewportSettings
);

const setCursorModeSettings = makeImmerSetter(
    useDashboardToolbarStore.getState().setCursorModeSettings
);

const setMarkingSettings = makeImmerSetter(
    useDashboardToolbarStore.getState().setMarkingSettings
);

class DashboardToolbarClass {
    readonly actions = {
        settings: {
            viewport: {
                toggleLockedViewport() {
                    setViewportSettings(settings => {
                        settings.locked = !settings.locked;
                    });
                },
                toggleLockScaleSync() {
                    setViewportSettings(settings => {
                        settings.scaleSync = !settings.scaleSync;
                    });
                },
            },
            cursorMode: {
                setCursorMode(
                    mode: DashboardToolbarSettings["cursorMode"]["state"]
                ) {
                    setCursorModeSettings(settings => {
                        settings.state = mode;
                    });
                },
            },
            marking: {
                setMarkingBackgroundColor(color: string) {
                    setMarkingSettings(settings => {
                        settings.backgroundColor = color;
                    });
                },
                setMarkingSize(size: number) {
                    setMarkingSettings(settings => {
                        settings.size = size;
                    });
                },
                setMarkingTextColor(color: string) {
                    setMarkingSettings(settings => {
                        settings.textColor = color;
                    });
                },
            },
        },
    };

    get state() {
        return useDashboardToolbarStore.getState();
    }

    readonly use = useDashboardToolbarStore;
}

const DashboardToolbar = new DashboardToolbarClass();
export { DashboardToolbar };
