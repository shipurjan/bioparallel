/* eslint-disable no-param-reassign */

import { Draft, produce } from "immer";
import { ActionProduceCallback } from "../immer.helpers";
import {
    InternalMarking,
    Marking,
    MarkingsState as State,
    useMarkingsStore as useStore,
} from "./Markings.store";

const storeState = useStore.getState();

function* idGenerator(): Generator<string> {
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

const idGen = idGenerator();

function getMarkingWithId(marking: Marking): InternalMarking {
    return produce(marking, (draft: Draft<InternalMarking>) => {
        draft.id = idGen.next().value;
    }) as InternalMarking;
}

class StoreClass {
    private setMarkingsHash(
        callback: ActionProduceCallback<State["markingsHash"], State>
    ) {
        storeState.set(draft => {
            draft.markingsHash = callback(draft.markingsHash, draft);
        });
    }

    private setMarkings(
        callback: ActionProduceCallback<State["markings"], State>
    ) {
        storeState.set(draft => {
            draft.markings = callback(draft.markings, draft);
        });
    }

    private setMarkingsAndHash(
        callback: ActionProduceCallback<State["markings"], State>
    ) {
        this.setMarkingsHash(() => crypto.randomUUID());
        this.setMarkings(callback);
    }

    private setTemporaryMarking(
        callback: ActionProduceCallback<State["temporaryMarking"], State>
    ) {
        storeState.set(draft => {
            draft.temporaryMarking = callback(draft.temporaryMarking, draft);
        });
    }

    readonly actions = {
        markings: {
            addOne: (marking: Marking) => {
                this.setMarkingsAndHash(
                    produce(state => {
                        state.push(getMarkingWithId(marking));
                    })
                );
            },
            addMany: (markings: Marking[]) => {
                this.setMarkingsAndHash(
                    produce(state => {
                        state.push(...markings.map(getMarkingWithId));
                    })
                );
            },
            removeOneById: (id: string) => {
                this.setMarkingsAndHash(state => {
                    return state.filter(marking => marking.id !== id);
                });
            },
            removeManyById: (ids: string[]) => {
                this.setMarkingsAndHash(
                    produce(state => {
                        return state.filter(
                            marking => !ids.includes(marking.id)
                        );
                    })
                );
            },
            editOneById: (id: string, newMarking: Partial<Marking>) => {
                this.setMarkingsAndHash(
                    produce(state => {
                        const index = state.findIndex(m => m.id === id);
                        if (index === -1) throw new Error("Marking not found");

                        // eslint-disable-next-line security/detect-object-injection
                        Object.assign(state[index]!, newMarking);
                    })
                );
            },
            bindOneById: (id: string, boundMarkingId: string) => {
                this.setMarkingsAndHash(
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
                this.setTemporaryMarking(() => ({ id: "\0", ...marking }));
            },
        },
    };

    get state() {
        return useStore.getState();
    }

    readonly use = useStore;
}

const Store = new StoreClass();
export { Store as MarkingsStore };
