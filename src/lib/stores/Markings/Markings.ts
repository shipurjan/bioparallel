/* eslint-disable security/detect-object-injection */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

import { Draft, produce } from "immer";
import {
    CANVAS_ID,
    CanvasMetadata,
} from "@/components/pixi/canvas/hooks/useCanvasContext";
import { MarkingNotFoundError } from "@/lib/errors/custom-errors/MarkingNotFoundError";
import { showErrorDialog } from "@/lib/errors/showErrorDialog";
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

function* createIdGenerator(
    start = 0,
    end = Infinity,
    step = 1
): Generator<InternalMarking["id"]> {
    let iterationCount = 0;
    for (let i = start; i < end; i += step) {
        iterationCount += 1;
        let reset = (yield i) as number | string | undefined;
        if (reset !== undefined) {
            if (typeof reset === "number") i = reset - step;
            if (typeof reset === "string" && reset === "prev") i -= step;
            reset = undefined;
        }
    }
    return iterationCount;
}

const { setLastAddedMarking } = GlobalStateStore.actions.lastAddedMarking;

class StoreClass {
    readonly id: CANVAS_ID;

    readonly use: typeof useLeftStore;

    private idGenerator = createIdGenerator();

    constructor(id: CanvasMetadata["id"]) {
        this.id = id;
        this.use = id === CANVAS_ID.LEFT ? useLeftStore : useRightStore;
    }

    get state() {
        return this.use.getState();
    }

    private setCursor(callback: ActionProduceCallback<State["cursor"], State>) {
        this.state.set(draft => {
            draft.cursor = callback(draft.cursor, draft);
        });
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
            draft.markings = newMarkings;

            const lastMarking = newMarkings.at(-1);
            if (lastMarking !== undefined)
                setLastAddedMarking({ ...lastMarking, canvasId: this.id });
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
        cursor: {
            updateCursor: (rowIndex: number, id?: InternalMarking["id"]) => {
                this.setCursor(() => ({
                    rowIndex,
                    ...(id && { id }),
                }));
            },
            isFinite: () => {
                return Number.isFinite(this.state.cursor.rowIndex);
            },
            getMarkingAtCursor: () => {
                return this.state.markings.find(
                    m => m.id === this.state.cursor.id
                );
            },
        },
        table: {
            setTableRows: (rows: State["tableRows"]) => {
                this.state.set(draft => {
                    draft.tableRows = rows;
                });
            },
        },
        idGenerator: {
            reset: () => {
                this.idGenerator.next(0);
            },
            revert: () => {
                this.idGenerator.next("prev");
            },
        },
        markings: {
            reset: () => {
                this.actions.idGenerator.reset();
                this.state.reset();
            },
            addOne: (marking: Marking) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(
                            getInferredMarking(
                                marking,
                                marking.id ?? this.idGenerator.next().value
                            )
                        );
                    })
                );
            },
            addMany: (markings: Marking[]) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(
                            ...markings.map(marking =>
                                getInferredMarking(
                                    marking,
                                    marking.id ?? this.idGenerator.next().value
                                )
                            )
                        );
                    })
                );
            },
            removeOneById: (id: InternalMarking["id"]) => {
                this.setMarkingsAndUpdateHash(state => {
                    return state.filter(marking => marking.id !== id);
                });
            },
            removeManyById: (ids: InternalMarking["id"][]) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        return state.filter(
                            marking => !ids.includes(marking.id)
                        );
                    })
                );
            },
            editOneById: (
                id: InternalMarking["id"],
                newMarking: Partial<Marking>
            ) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        try {
                            const index = state.findIndex(m => m.id === id);
                            if (index === -1) throw new MarkingNotFoundError();

                            Object.assign(state[index]!, newMarking);
                        } catch (error) {
                            showErrorDialog(error);
                        }
                    })
                );
            },
            selectOneById: (
                id: InternalMarking["id"],
                callback: (
                    oldSelected: Marking["selected"]
                ) => Marking["selected"]
            ) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        try {
                            const index = state.findIndex(m => m.id === id);
                            if (index === -1) throw new MarkingNotFoundError();

                            state[index]!.selected = callback(
                                state[index]!.selected
                            );
                        } catch (error) {
                            showErrorDialog(error);
                        }
                    })
                );
            },
        },
        temporaryMarking: {
            setTemporaryMarking: (
                marking: Marking | null,
                options?: { revertGeneratorId?: boolean }
            ) => {
                if (marking === null) {
                    if (options?.revertGeneratorId) {
                        this.actions.idGenerator.revert();
                    }
                    this.setTemporaryMarking(() => null);
                } else {
                    this.setTemporaryMarking(() => ({
                        id: this.idGenerator.next().value,
                        ...marking,
                    }));
                }
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
    marking: Marking,
    id: InternalMarking["id"]
): InternalMarking {
    return produce(marking, (draft: Draft<InternalMarking>) => {
        draft.id = id;
    }) as InternalMarking;
}

export { Store as MarkingsStore };
export { StoreClass as MarkingsStoreClass };
