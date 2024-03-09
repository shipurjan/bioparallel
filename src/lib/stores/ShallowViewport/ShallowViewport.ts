/* eslint-disable no-param-reassign */

import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { ActionProduceCallback } from "../immer.helpers";
import {
    ShallowViewportSize,
    ShallowViewportState as State,
    _createShallowViewportStore as createStore,
} from "./ShallowViewport.store";

const useLeftStore = createStore("left");
const useRightStore = createStore("right");

class StoreClass {
    readonly use: typeof useLeftStore | typeof useRightStore;

    constructor(id: CanvasMetadata["id"]) {
        this.use = id === "left" ? useLeftStore : useRightStore;
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

const LeftStore = new StoreClass("left");
const RightStore = new StoreClass("right");

export const Store = (id: CanvasMetadata["id"]) => {
    switch (id) {
        case "left":
            return LeftStore;
        case "right":
            return RightStore;
        default:
            throw new Error(`Invalid canvas id: ${id}`);
    }
};

export { Store as ShallowViewportStore };
