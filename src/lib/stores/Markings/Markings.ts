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
import { getOppositeCanvasId } from "@/components/pixi/canvas/utils/get-opposite-canvas-id";
import { arrayMax } from "@/lib/utils/array/minmax";
// eslint-disable-next-line import/no-cycle
import { EmptyableMarking } from "@/components/information-tabs/markings-info/columns";
import { ActionProduceCallback } from "../immer.helpers";
import {
    InternalMarking,
    Marking,
    MarkingsState as State,
    _createMarkingsStore as createStore,
} from "./Markings.store";
import { GlobalStateStore } from "../GlobalState";
import { IDGenerator } from "./IdGenerator";

const useLeftStore = createStore(CANVAS_ID.LEFT);
const useRightStore = createStore(CANVAS_ID.RIGHT);

const { setLastAddedMarking } = GlobalStateStore.actions.lastAddedMarking;

class StoreClass {
    readonly id: CANVAS_ID;

    readonly use: typeof useLeftStore;

    private labelGenerator = new IDGenerator();

    constructor(id: CanvasMetadata["id"]) {
        this.id = id;
        this.use = id === CANVAS_ID.LEFT ? useLeftStore : useRightStore;
    }

    get state() {
        return this.use.getState();
    }

    private getInferredMarking(
        canvasId: CANVAS_ID,
        marking: Marking
    ): InternalMarking {
        return produce(marking, (draft: Draft<InternalMarking>) => {
            draft.id = crypto.randomUUID();

            if (draft.label !== undefined && draft.label !== -1) {
                // Przypadek gdy ostatnio dodany marking ma już przypisany label
                // (Najczęściej jest to sytuacja gdy wgrywamy plik z danymi markingu)
                // Znajdź czy istnieje znacznik z takim samym labelem w przeciwnym canvasie
                // Jeśli tak to przypisz go do tego markingu i powiąż je
                const oppositeCanvasId = getOppositeCanvasId(canvasId);
                const boundMarking = Store(
                    oppositeCanvasId
                ).state.markings.find(e => e.label === draft.label);

                if (boundMarking === undefined) {
                    return;
                }
                Store(oppositeCanvasId).actions.markings.bindOneById(
                    boundMarking.id,
                    draft.id
                );
                draft.boundMarkingId = boundMarking.id;
                draft.label = boundMarking.label;
                return;
            }

            const { lastAddedMarking } = GlobalStateStore.state;
            const isLastAddedMarkingInOppositeCanvas =
                lastAddedMarking !== null &&
                lastAddedMarking.canvasId !== canvasId;

            if (isLastAddedMarkingInOppositeCanvas) {
                // Przypadek gdy ostatnio dodany marking jest z przeciwnego canvasa
                // Weź znacznik z ostatnio dodanego markingu i powiąż go z tym markingiem

                const isLabelAlreadyUsed =
                    Store(canvasId).state.markings.findLastIndex(
                        m => m.label === lastAddedMarking.label
                    ) !== -1;

                if (isLabelAlreadyUsed) {
                    draft.label = this.labelGenerator.generateId();
                } else {
                    draft.label = lastAddedMarking.label;
                    this.labelGenerator.setId(lastAddedMarking.label);
                }

                if (lastAddedMarking.label === draft.label) {
                    draft.boundMarkingId = lastAddedMarking.id;
                    Store(
                        lastAddedMarking.canvasId
                    ).actions.markings.bindOneById(
                        lastAddedMarking.id,
                        draft.id
                    );
                }

                return;
            }

            // Przypadek gdy ostatnio dodany marking jest z tego samego canvasa
            // Po prostu wygeneruj nowy znacznik
            draft.label = this.labelGenerator.generateId();
        }) as InternalMarking;
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

    private setSelectedMarking(
        callback: ActionProduceCallback<State["selectedMarking"], State>
    ) {
        this.state.set(draft => {
            draft.selectedMarking = callback(draft.selectedMarking, draft);
        });
    }

    readonly actions = {
        labelGenerator: {
            reset: () => {
                this.labelGenerator = new IDGenerator();

                const oppositeCanvasId = getOppositeCanvasId(this.id);
                const oppositeCanvasLabels = Store(
                    oppositeCanvasId
                ).state.markings.map(m => m.label);
                const thisCanvasLabels = this.state.markings.map(m => m.label);

                const maxLabel =
                    arrayMax([...oppositeCanvasLabels, ...thisCanvasLabels]) ??
                    0;
                this.labelGenerator.setId(maxLabel);
            },
        },
        markings: {
            reset: () => {
                this.labelGenerator = new IDGenerator();
                this.state.markings.forEach(marking => {
                    Store(
                        getOppositeCanvasId(this.id)
                    ).actions.markings.unbindAllWithBoundMarkingId(marking.id);
                });
                this.setMarkingsAndUpdateHash(() => []);
            },
            addOne: (marking: Marking) => {
                const inferredMarking = this.getInferredMarking(
                    this.id,
                    marking
                );
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(inferredMarking);
                    })
                );
                return inferredMarking;
            },
            addMany: (markings: Marking[]) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(
                            ...markings.map(m =>
                                this.getInferredMarking(this.id, m)
                            )
                        );
                    })
                );
            },
            removeOneById: (id: string) => {
                this.setMarkingsAndUpdateHash(markings => {
                    return markings.filter(marking => marking.id !== id);
                });
            },
            removeManyById: (ids: string[]) => {
                this.setMarkingsAndUpdateHash(markings =>
                    markings.filter(marking => !ids.includes(marking.id))
                );
            },
            editOneById: (id: string, newMarking: Partial<Marking>) => {
                this.setMarkingsAndUpdateHash(markings => {
                    return markings.map(marking => {
                        if (marking.id === id) {
                            return { ...marking, ...newMarking };
                        }
                        return marking;
                    });
                });
            },
            bindOneById: (id: string, boundMarkingId: string) => {
                this.setMarkingsAndUpdateHash(markings =>
                    markings.map(m =>
                        m.id === id ? { ...m, boundMarkingId } : m
                    )
                );
            },
            unbindOneById: (id: string) => {
                this.setMarkingsAndUpdateHash(markings =>
                    markings.map(m =>
                        m.id === id ? { ...m, boundMarkingId: undefined } : m
                    )
                );
            },
            unbindAllWithBoundMarkingId: (boundMarkingId: string) => {
                this.setMarkingsAndUpdateHash(markings =>
                    markings.map(m =>
                        m.boundMarkingId === boundMarkingId
                            ? { ...m, boundMarkingId: undefined }
                            : m
                    )
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
                label?: InternalMarking["label"]
            ) => {
                if (marking === null) {
                    this.setTemporaryMarking(() => null);
                    return;
                }
                this.setTemporaryMarking(() => ({
                    id: "\0",
                    label: label ?? -1,
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
        selectedMarking: {
            setSelectedMarking: (marking: EmptyableMarking | null) => {
                if (marking === null) {
                    this.setSelectedMarking(() => null);
                    return;
                }
                this.setSelectedMarking(() => marking);
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

export { Store as MarkingsStore };
export { StoreClass as MarkingsStoreClass };
