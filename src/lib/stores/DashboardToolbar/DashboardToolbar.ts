/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { CUSTOM_GLOBAL_EVENTS } from "@/lib/utils/const";
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

    private setCursorSettings(
        callback: ActionProduceCallback<State["settings"]["cursor"], State>
    ) {
        this.state.set(draft => {
            draft.settings.cursor = callback(draft.settings.cursor, draft);
        });
        document.dispatchEvent(new Event(CUSTOM_GLOBAL_EVENTS.CLEANUP));
    }

    private setViewportSettings(
        callback: ActionProduceCallback<State["settings"]["viewport"], State>
    ) {
        this.state.set(draft => {
            draft.settings.viewport = callback(draft.settings.viewport, draft);
        });
    }

    private setMarkingSettings(
        callback: ActionProduceCallback<State["settings"]["marking"], State>
    ) {
        this.state.set(draft => {
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

    readonly types = {
        CursorMode: "selection" as const,
    };
}

const Store = new StoreClass();
export { Store as DashboardToolbarStore };
export { type StoreClass as DashboardToolbarStoreClass };
