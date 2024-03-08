/* eslint-disable no-param-reassign */

import { makeImmerSetter } from "../immer.helpers";
import {
    DashboardToolbarSettings,
    useDashboardToolbarStore,
} from "./DashboardToolbar.store";

const ACTIONS = {
    settings: {
        viewport: {
            setViewportSettings: makeImmerSetter(
                useDashboardToolbarStore.getState().setViewportSettings
            ),
            toggleLockedViewport() {
                this.setViewportSettings(settings => {
                    settings.locked = !settings.locked;
                });
            },
            toggleLockScaleSync() {
                this.setViewportSettings(settings => {
                    settings.scaleSync = !settings.scaleSync;
                });
            },
        },
        cursorMode: {
            setCursorModeSettings: makeImmerSetter(
                useDashboardToolbarStore.getState().setCursorModeSettings
            ),
            setCursorMode(
                mode: DashboardToolbarSettings["cursorMode"]["state"]
            ) {
                this.setCursorModeSettings(settings => {
                    settings.state = mode;
                });
            },
        },
        marking: {
            setMarkingSettings: makeImmerSetter(
                useDashboardToolbarStore.getState().setMarkingSettings
            ),
            setMarkingBackgroundColor(color: string) {
                this.setMarkingSettings(settings => {
                    settings.backgroundColor = color;
                });
            },
            setMarkingSize(size: number) {
                this.setMarkingSettings(settings => {
                    settings.size = size;
                });
            },
            setMarkingTextColor(color: string) {
                this.setMarkingSettings(settings => {
                    settings.textColor = color;
                });
            },
        },
    },
};

class DashboardToolbarClass {
    readonly use = useDashboardToolbarStore;

    readonly actions = ACTIONS;

    get state() {
        return useDashboardToolbarStore.getState();
    }
}

const DashboardToolbar = new DashboardToolbarClass();
export { DashboardToolbar };
