/* eslint-disable no-param-reassign */

import { produce } from "immer";
import {
    CANVAS_ID,
    CanvasMetadata,
} from "@/components/pixi/canvas/hooks/useCanvasContext";
import { CUSTOM_GLOBAL_EVENTS } from "@/lib/utils/const";
import { ActionProduceCallback } from "../immer.helpers";
import {
    CanvasToolbarState as State,
    _createCanvasToolbarStore as createStore,
} from "./CanvasToolbar.store";

const useLeftStore = createStore(CANVAS_ID.LEFT);
const useRightStore = createStore(CANVAS_ID.RIGHT);

class StoreClass {
    readonly id: CANVAS_ID;

    readonly use: typeof useLeftStore;

    constructor(id: CanvasMetadata["id"]) {
        this.id = id;
        this.use = id === CANVAS_ID.LEFT ? useLeftStore : useRightStore;
    }

    get state() {
        return this.use.getState();
    }

    private setWithCleanup: typeof this.state.set = callback => {
        this.state.set(callback);
        document.dispatchEvent(new Event(CUSTOM_GLOBAL_EVENTS.CLEANUP));
    };

    private setTextureSettings(
        callback: ActionProduceCallback<State["settings"]["texture"], State>
    ) {
        this.setWithCleanup(draft => {
            draft.settings.texture = callback(draft.settings.texture, draft);
        });
    }

    private setMarkingsSettings(
        callback: ActionProduceCallback<State["settings"]["markings"], State>
    ) {
        this.setWithCleanup(draft => {
            draft.settings.markings = callback(draft.settings.markings, draft);
        });
    }

    readonly actions = {
        settings: {
            texture: {
                setScaleMode: (
                    newScaleMode: State["settings"]["texture"]["scaleMode"]
                ) => {
                    this.setTextureSettings(
                        produce(texture => {
                            texture.scaleMode = newScaleMode;
                        })
                    );
                },
            },
            markings: {
                setShowLabels: (
                    showLabel: State["settings"]["markings"]["showLabels"]
                ) => {
                    this.setMarkingsSettings(
                        produce(markings => {
                            markings.showLabels = showLabel;
                        })
                    );
                },
            },
        },
    };
}

const LeftStore = new StoreClass(CANVAS_ID.LEFT);
const RightStore = new StoreClass(CANVAS_ID.RIGHT);

export const Store = (id: CanvasMetadata["id"]) => {
    switch (id) {
        case CANVAS_ID.LEFT:
            return LeftStore;
        case CANVAS_ID.RIGHT:
            return RightStore;
        default:
            throw new Error(id satisfies never);
    }
};

export { Store as CanvasToolbarStore };
export { type StoreClass as CanvasToolbarStoreClass };
