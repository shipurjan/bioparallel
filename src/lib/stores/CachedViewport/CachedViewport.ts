/* eslint-disable no-param-reassign */

import {
    CANVAS_ID,
    CanvasMetadata,
} from "@/components/pixi/canvas/hooks/useCanvasContext";
import { ActionProduceCallback } from "../immer.helpers";
import {
    CachedViewportState as State,
    _createCachedViewportStore as createStore,
} from "./CachedViewport.store";

const useLeftStore = createStore(CANVAS_ID.LEFT);
const useRightStore = createStore(CANVAS_ID.RIGHT);

class StoreClass {
    readonly use: typeof useLeftStore | typeof useRightStore;

    constructor(id: CanvasMetadata["id"]) {
        this.use = id === "left" ? useLeftStore : useRightStore;
    }

    private setScaled(callback: ActionProduceCallback<State["scaled"], State>) {
        this.use.getState().set(draft => {
            draft.scaled = callback(draft.scaled, draft);
        });
    }

    private setPosition(
        callback: ActionProduceCallback<State["position"], State>
    ) {
        this.use.getState().set(draft => {
            draft.position = callback(draft.position, draft);
        });
    }

    private setOtherScaled(
        callback: ActionProduceCallback<State["otherScaled"], State>
    ) {
        this.use.getState().set(draft => {
            draft.otherScaled = callback(draft.otherScaled, draft);
        });
    }

    private setRayPosition(
        callback: ActionProduceCallback<State["rayPosition"], State>
    ) {
        this.use.getState().set(draft => {
            draft.rayPosition = callback(draft.rayPosition, draft);
        });
    }

    private setRayAngleRad(
        callback: ActionProduceCallback<State["rayAngleRad"], State>
    ) {
        this.use.getState().set(draft => {
            draft.rayAngleRad = callback(draft.rayAngleRad, draft);
        });
    }

    readonly actions = {
        viewport: {
            other: {
                setScaled: (scaled: State["otherScaled"]) => {
                    this.setOtherScaled(() => scaled);
                },
            },
            setScaled: (scaled: State["scaled"]) => {
                this.setScaled(() => scaled);
            },
            setPosition: (position: State["position"]) => {
                this.setPosition(() => position);
            },
            setRayAngleRad: (rayAngleRad: State["rayAngleRad"]) => {
                this.setRayAngleRad(() => rayAngleRad);
            },
            setRayPosition: (rayPosition: State["rayPosition"]) => {
                this.setRayPosition(() => rayPosition);
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
        case "left":
            return LeftStore;
        case "right":
            return RightStore;
        default:
            throw new Error(`Invalid canvas id: ${id}`);
    }
};

export { Store as CachedViewportStore };
export { type StoreClass as CachedViewportStoreClass };
