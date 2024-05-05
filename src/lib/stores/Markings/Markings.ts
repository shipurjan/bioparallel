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
import { ActionProduceCallback } from "../immer.helpers";
import {
    Cursor,
    InternalMarking,
    Marking,
    MarkingsState as State,
    _createMarkingsStore as createStore,
} from "./Markings.store";
import { GlobalStateStore } from "../GlobalState";

const useLeftStore = createStore(CANVAS_ID.LEFT);
const useRightStore = createStore(CANVAS_ID.RIGHT);

function* createLabelGenerator(
    start = 0,
    end = Infinity,
    step = 1
): Generator<InternalMarking["label"]> {
    for (let i = start; i < end; i += step) {
        let reset = (yield i) as number | string | undefined;
        if (reset !== undefined) {
            if (typeof reset === "number") i = reset - step;
            if (typeof reset === "string" && reset === "prev") i -= step;
            reset = undefined;
        }
    }
}

const { setLastAddedMarking } = GlobalStateStore.actions.lastAddedMarking;

class StoreClass {
    readonly id: CANVAS_ID;

    readonly use: typeof useLeftStore;

    private labelGenerator = createLabelGenerator();

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
                    draft.label = this.labelGenerator.next().value;
                } else {
                    draft.label = lastAddedMarking.label;
                    this.labelGenerator.next(lastAddedMarking.label);
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
            draft.label = this.labelGenerator.next().value;
        }) as InternalMarking;
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
            updateCursor: (
                rowIndex: number,
                label: Cursor["label"],
                type: Cursor["type"],
                id: Cursor["id"],
                boundMarkingId: Cursor["boundMarkingId"]
            ) => {
                this.setCursor(() => ({
                    rowIndex,
                    ...(id && { id }),
                    ...(label && { label }),
                    ...(type && { type }),
                    ...(boundMarkingId && { boundMarkingId }),
                }));
            },
            isFinite: () => {
                return Number.isFinite(this.state.cursor.rowIndex);
            },
            getMarkingAtCursor: () => {
                return (
                    this.state.markings.find(
                        m => m.id === this.state.cursor.id
                    ) ??
                    this.state.markings.find(
                        m =>
                            m.boundMarkingId ===
                            this.state.cursor.boundMarkingId
                    )
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
        labelGenerator: {
            reset: () => {
                this.labelGenerator = createLabelGenerator();

                const oppositeCanvasId = getOppositeCanvasId(this.id);
                const oppositeCanvasLabels = Store(
                    oppositeCanvasId
                ).state.markings.map(m => m.label);

                const maxLabel = arrayMax(oppositeCanvasLabels) ?? 0;
                this.labelGenerator.next(maxLabel);
                this.labelGenerator.next(maxLabel);
            },
        },
        markings: {
            reset: () => {
                this.state.reset();
                this.actions.labelGenerator.reset();
                GlobalStateStore.actions.lastAddedMarking.setLastAddedMarking(
                    null
                );
            },
            addOne: (marking: Marking) => {
                this.setMarkingsAndUpdateHash(
                    produce(state => {
                        state.push(this.getInferredMarking(this.id, marking));
                    })
                );
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
