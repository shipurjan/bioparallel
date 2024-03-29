/* eslint-disable security/detect-object-injection */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

import { Draft, produce } from "immer";
import {
    CANVAS_ID,
    CanvasMetadata,
} from "@/components/pixi/canvas/hooks/useCanvasContext";
import { LABEL_MAP } from "@/lib/utils/const";
import { MarkingNotFoundError } from "@/lib/custom-errors/MarkingNotFoundError";
import { ActionProduceCallback } from "../immer.helpers";
import {
    InternalMarking,
    Marking,
    MarkingsState as State,
    _createMarkingsStore as createStore,
} from "./Markings.store";
import { GlobalStateStore } from "../GlobalState";

const useLeftStore = createStore(CANVAS_ID.LEFT);
const useRightStore = createStore(CANVAS_ID.RIGHT);

function* labelGenerator(): Generator<string> {
    let index = 0;
    while (true) {
        const offset =
            (yield LABEL_MAP[index] ?? String(index - LABEL_MAP.length + 1)) ===
            "prev"
                ? -1
                : 1;
        index += offset;
    }
}

const labelGen = labelGenerator();

const { setLastAddedMarking } = GlobalStateStore.actions.lastAddedMarking;

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
            const newMarkings = callback(draft.markings, draft);
            const lastMarking = newMarkings.at(-1);
            if (lastMarking !== undefined) {
                setLastAddedMarking({ ...lastMarking, canvasId: this.id });
            }
            draft.markings = newMarkings;
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
                        state.push(getInferredMarking(this.id, marking));
                    })
                );
            },
            addMany: (markings: Marking[]) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(
                            ...markings.map(m => getInferredMarking(this.id, m))
                        );
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
                        if (index === -1) throw new MarkingNotFoundError();

                        Object.assign(state[index]!, newMarking);
                    })
                );
            },
            bindOneById: (id: string, boundMarkingId: string) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        const index = state.findIndex(m => m.id === id);
                        if (index === -1) throw new MarkingNotFoundError();

                        Object.assign(state[index]!, { boundMarkingId });
                    })
                );
            },
            selectOneById: (
                id: string,
                callback: (
                    oldSelected: Marking["selected"]
                ) => Marking["selected"]
            ) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        const index = state.findIndex(m => m.id === id);
                        if (index === -1) throw new MarkingNotFoundError();

                        state[index]!.selected = callback(
                            state[index]!.selected
                        );
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

// funkcja która nadaje id, label oraz id powiązanego markinga dla nowego markingu
function getInferredMarking(
    canvasId: CANVAS_ID,
    marking: Marking
): InternalMarking {
    return produce(marking, (draft: Draft<InternalMarking>) => {
        draft.id = crypto.randomUUID();

        const { lastAddedMarking } = GlobalStateStore.state;
        const isLastAddedMarkingInOppositeCanvas =
            lastAddedMarking !== null && lastAddedMarking.canvasId !== canvasId;

        if (isLastAddedMarkingInOppositeCanvas) {
            // Przypadek gdy ostatnio dodany marking jest z przeciwnego canvasa
            // Weź znacznik z ostatnio dodanego markingu i powiąż go z tym markingiem

            draft.boundMarkingId = lastAddedMarking.id;
            Store(lastAddedMarking.canvasId).actions.markings.bindOneById(
                lastAddedMarking.id,
                draft.id
            );

            const isLabelAlreadyUsed =
                Store(canvasId).state.markings.findLastIndex(
                    m => m.label === lastAddedMarking.label
                ) !== -1;

            draft.label = isLabelAlreadyUsed
                ? labelGen.next().value
                : lastAddedMarking.label;
        } else {
            // Przypadek gdy ostatnio dodany marking jest z tego samego canvasa
            // Po prostu wygeneruj nowy znacznik
            draft.label = labelGen.next().value;
        }
    }) as InternalMarking;
}

export { Store as MarkingsStore };
export { StoreClass as MarkingsStoreClass };
