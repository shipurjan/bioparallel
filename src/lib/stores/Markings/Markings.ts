/* eslint-disable no-param-reassign */

import { Draft, produce } from "immer";
import {
    CANVAS_ID,
    CanvasMetadata,
} from "@/components/pixi/canvas/hooks/useCanvasContext";
import { ActionProduceCallback } from "../immer.helpers";
import {
    InternalMarking,
    Marking,
    MarkingsState as State,
    _createMarkingsStore as createStore,
} from "./Markings.store";

const useLeftStore = createStore(CANVAS_ID.LEFT);
const useRightStore = createStore(CANVAS_ID.RIGHT);

function* labelGenerator(): Generator<string> {
    const initialSymbols = "ABCDEFGHIJKLMNPQRSTUVWXYZαβΓδεζηλμπρΣτΦΩ";
    let index = 0;
    while (true) {
        const offset =
            // eslint-disable-next-line security/detect-object-injection
            (yield initialSymbols[index] ??
                String(index - initialSymbols.length)) === "prev"
                ? -1
                : 1;
        index += offset;
    }
}

const labelGen = labelGenerator();

function getMarkingWithLabelAndId(marking: Marking): InternalMarking {
    return produce(marking, (draft: Draft<InternalMarking>) => {
        draft.id = crypto.randomUUID();
        draft.label = labelGen.next().value as string;
    }) as InternalMarking;
}

class StoreClass {
    readonly use: typeof useLeftStore;

    constructor(id: CanvasMetadata["id"]) {
        this.use = id === CANVAS_ID.LEFT ? useLeftStore : useRightStore;
    }

    get state() {
        return this.use.getState();
    }

    private setMarkingsHash(
        callback: ActionProduceCallback<State["markingsHash"], State>
    ) {
        this.state.set(draft => {
            draft.markingsHash = callback(draft.markingsHash, draft);
        });
    }

    private setMarkings(
        callback: ActionProduceCallback<State["markings"], State>
    ) {
        this.state.set(draft => {
            draft.markings = callback(draft.markings, draft);
        });
    }

    private setMarkingsAndUpdateHash(
        callback: ActionProduceCallback<State["markings"], State>
    ) {
        this.setMarkingsHash(() => crypto.randomUUID());
        this.setMarkings(callback);
    }

    private setTemporaryMarking(
        callback: ActionProduceCallback<State["temporaryMarking"], State>
    ) {
        this.state.set(draft => {
            draft.temporaryMarking = callback(draft.temporaryMarking, draft);
        });
    }

    readonly actions = {
        markings: {
            addOne: (marking: Marking) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(getMarkingWithLabelAndId(marking));
                    })
                );
            },
            addMany: (markings: Marking[]) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(...markings.map(getMarkingWithLabelAndId));
                    })
                );
            },
            removeOneById: (id: string) => {
                this.setMarkingsAndUpdateHash(state => {
                    return state.filter(marking => marking.id !== id);
                });
            },
            removeManyById: (ids: string[]) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        return state.filter(
                            marking => !ids.includes(marking.id)
                        );
                    })
                );
            },
            editOneById: (id: string, newMarking: Partial<Marking>) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        const index = state.findIndex(m => m.id === id);
                        if (index === -1) throw new Error("Marking not found");

                        // eslint-disable-next-line security/detect-object-injection
                        Object.assign(state[index]!, newMarking);
                    })
                );
            },
            bindOneById: (id: string, boundMarkingId: string) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        const index = state.findIndex(m => m.id === id);
                        if (index === -1) throw new Error("Marking not found");

                        // eslint-disable-next-line security/detect-object-injection
                        Object.assign(state[index]!, { boundMarkingId });
                    })
                );
            },
        },
        temporaryMarking: {
            setTemporaryMarking: (marking: Marking | null) => {
                if (marking === null) {
                    this.setTemporaryMarking(() => null);
                    return;
                }
                this.setTemporaryMarking(() => ({
                    id: "\0",
                    label: "\0",
                    ...marking,
                }));
            },
            updateTemporaryMarking: (props: Partial<Marking>) => {
                this.setTemporaryMarking(
                    produce(state => {
                        if (state !== null) {
                            Object.assign(state, props);
                        }
                    })
                );
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

export { Store as MarkingsStore };
export { StoreClass as MarkingsStoreClass };
