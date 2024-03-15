/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { ActionProduceCallback } from "../immer.helpers";
import {
    DashboardToolbarState as State,
    _useDashboardToolbarStore as useStore,
} from "./DashboardToolbar.store";

class StoreClass {
    readonly use = useStore;

    get state() {
        return this.use.getState();
    }

    private setWithCleanup: typeof this.state.set = callback => {
        this.state.set(callback);
        document.dispatchEvent(new Event("cleanup"));
    };

    private setCursorSettings(
        callback: ActionProduceCallback<State["settings"]["cursor"], State>
    ) {
        this.setWithCleanup(draft => {
            draft.settings.cursor = callback(draft.settings.cursor, draft);
        });
    }

    private setViewportSettings(
        callback: ActionProduceCallback<State["settings"]["viewport"], State>
    ) {
        this.setWithCleanup(draft => {
            draft.settings.viewport = callback(draft.settings.viewport, draft);
        });
    }

    private setMarkingSettings(
        callback: ActionProduceCallback<State["settings"]["marking"], State>
    ) {
        this.setWithCleanup(draft => {
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
                setMarkingType: (
                    type: State["settings"]["marking"]["type"]
                ) => {
                    this.setMarkingSettings(
                        produce(settings => {
                            settings.type = type;
                        })
                    );
                },
                setMarkingBackgroundColor: (
                    color: State["settings"]["marking"]["backgroundColor"]
                ) => {
                    this.setMarkingSettings(
                        produce(settings => {
                            settings.backgroundColor = color;
                        })
                    );
                },
                setMarkingSize: (
                    size: State["settings"]["marking"]["size"]
                ) => {
                    this.setMarkingSettings(
                        produce(settings => {
                            settings.size = size;
                        })
                    );
                },
                setMarkingTextColor: (
                    color: State["settings"]["marking"]["textColor"]
                ) => {
                    this.setMarkingSettings(
                        produce(settings => {
                            settings.textColor = color;
                        })
                    );
                },
            },
        },
    };
}

const Store = new StoreClass();
export { Store as DashboardToolbarStore };
export { type StoreClass as DashboardToolbarStoreClass };
