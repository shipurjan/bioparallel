/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { ActionProduceCallback } from "../immer.helpers";
import {
    DashboardToolbarState as State,
    useDashboardToolbarStore as useStore,
} from "./DashboardToolbar.store";

const storeState = useStore.getState();

class StoreClass {
    private setCursorSettings(
        callback: ActionProduceCallback<State["settings"]["cursor"], State>
    ) {
        storeState.set(draft => {
            draft.settings.cursor = callback(draft.settings.cursor, draft);
        });
    }

    private setViewportSettings(
        callback: ActionProduceCallback<State["settings"]["viewport"], State>
    ) {
        storeState.set(draft => {
            draft.settings.viewport = callback(draft.settings.viewport, draft);
        });
    }

    private setMarkingSettings(
        callback: ActionProduceCallback<State["settings"]["marking"], State>
    ) {
        storeState.set(draft => {
            draft.settings.marking = callback(draft.settings.marking, draft);
        });
    }

    readonly actions = {
        settings: {
            viewport: {
                toggleLockedViewport: () => {
                    this.setViewportSettings(
                        produce(settings => {
                            settings.locked = !settings.locked;
                        })
                    );
                },
                toggleLockScaleSync: () => {
                    this.setViewportSettings(
                        produce(settings => {
                            settings.scaleSync = !settings.scaleSync;
                        })
                    );
                },
            },
            cursor: {
                setCursorMode: (mode: State["settings"]["cursor"]["mode"]) => {
                    this.setCursorSettings(
                        produce(cursor => {
                            cursor.mode = mode;
                        })
                    );
                },
            },
            marking: {
                setMarkingBackgroundColor: (color: string) => {
                    this.setMarkingSettings(
                        produce(settings => {
                            settings.backgroundColor = color;
                        })
                    );
                },
                setMarkingSize: (size: number) => {
                    this.setMarkingSettings(
                        produce(settings => {
                            settings.size = size;
                        })
                    );
                },
                setMarkingTextColor: (color: string) => {
                    this.setMarkingSettings(
                        produce(settings => {
                            settings.textColor = color;
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
export { Store as DashboardToolbarStore };
