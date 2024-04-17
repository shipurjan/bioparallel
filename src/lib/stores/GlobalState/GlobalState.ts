/* eslint-disable security/detect-object-injection */
/* eslint-disable no-param-reassign */

import { ActionProduceCallback } from "../immer.helpers";
import {
    GlobalState as State,
    _useGlobalStateStore as useStore,
} from "./GlobalState.store";

class StoreClass {
    readonly use = useStore;

    get state() {
        return this.use.getState();
    }

    private setLastAddedMarking(
        callback: ActionProduceCallback<State["lastAddedMarking"], State>
    ) {
        this.state.set(draft => {
            draft.lastAddedMarking = callback(draft.lastAddedMarking, draft);
        });
    }

    readonly actions = {
        lastAddedMarking: {
            setLastAddedMarking: (newMarking: State["lastAddedMarking"]) => {
                this.setLastAddedMarking(() => newMarking);
            },
        },
    };
}

const Store = new StoreClass();
export { Store as GlobalStateStore };
export { StoreClass as GlobalStateStoreClass };
