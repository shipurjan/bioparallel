/* eslint-disable no-param-reassign */

import {
    CANVAS_ID,
    CanvasMetadata,
} from "@/components/pixi/canvas/hooks/useCanvasContext";
import { ActionProduceCallback } from "../immer.helpers";
import {
    ShallowViewportSize,
    ShallowViewportState as State,
    _createShallowViewportStore as createStore,
} from "./ShallowViewport.store";

const useLeftStore = createStore(CANVAS_ID.LEFT);
const useRightStore = createStore(CANVAS_ID.RIGHT);

class StoreClass {
    readonly use: typeof useLeftStore | typeof useRightStore;

    constructor(id: CanvasMetadata["id"]) {
        this.use = id === CANVAS_ID.LEFT ? useLeftStore : useRightStore;
    }

    private setSize(callback: ActionProduceCallback<State["size"], State>) {
        this.use.getState().set(draft => {
            draft.size = callback(draft.size, draft);
        });
    }

    readonly actions = {
        size: {
            setSize: (size: ShallowViewportSize) => {
                this.setSize(() => size);
            },
        },
    };

    get state() {
        return this.use.getState();
    }
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
            throw new Error(`Invalid canvas id: ${id}`);
    }
};

export { Store as ShallowViewportStore };
export { StoreClass as ShallowViewportStoreClass };
