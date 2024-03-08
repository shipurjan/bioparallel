/* eslint-disable no-param-reassign */
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { Draft, produce } from "immer";
import { ColorSource } from "pixi.js";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";

export type InternalMarking = {
    id: string;
    canvasId: CanvasMetadata["id"];
    position: {
        x: number;
        y: number;
    };
    backgroundColor: ColorSource;
    textColor: ColorSource;
    size: number;
    type: "point" | "angle";
    angle: number;
    boundMarkingId?: InternalMarking["id"];
};

export type RenderableMarking = InternalMarking & {
    visible: boolean;
};

export type Marking = Omit<InternalMarking, "id">;

type MarkingsState = {
    markingsHash: string;
    markings: InternalMarking[];
    temporaryMarking: InternalMarking | null;
    setHash: (hash: string) => void;
    setTemporary: (temporaryMarking: Marking | null) => void;
    setMarkings: (
        callback: (
            newSettings: MarkingsState["markings"]
        ) => MarkingsState["markings"]
    ) => void;
};

export const useMarkingsStore = createWithEqualityFn<MarkingsState>()(
    devtools(set => ({
        markingsHash: crypto.randomUUID(),
        temporaryMarking: null,
        markings: [],
        setHash: hash => set({ markingsHash: hash }),
        setTemporary: temporaryMarking =>
            set(
                produce((state: MarkingsState) => {
                    if (temporaryMarking === null) {
                        state.temporaryMarking = null;
                    } else {
                        state.temporaryMarking = {
                            id: "\0",
                            ...temporaryMarking,
                        };
                    }
                })
            ),
        setMarkings: callback =>
            set(
                produce((state: MarkingsState) => {
                    state.markings = callback(state.markings);
                    // zaktualizuj hash, gdyż jest on używany do sprawdzania, czy zmienił się stan markingów
                    state.markingsHash = crypto.randomUUID();
                })
            ),
    }))
);

// Generator id dla markingów
function* idGenerator(): Generator<string> {
    const initialSymbols = "ABCDEFGHIJKLMNPQRSTUVWXYZαβΓδεζηλμπρΣτΦΩ";
    let index = 0;
    while (true) {
        // eslint-disable-next-line no-plusplus
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

class MarkingsClass {
    // helper getter dla komponentów nie-Reactowych;
    // dla komponentów React używaj useGlobalToolbarStore
    get markings() {
        return useMarkingsStore.getState().markings;
    }

    get markingsHash() {
        return useMarkingsStore.getState().markingsHash;
    }

    get temporaryMarking() {
        return useMarkingsStore.getState().temporaryMarking;
    }

    addOne(marking: Marking) {
        useMarkingsStore.getState().setMarkings(
            produce(state => {
                state.push(getMarkingWithId(marking));
            })
        );
    }

    addMany(markings: Marking[]) {
        useMarkingsStore.getState().setMarkings(
            produce(state => {
                state.push(...markings.map(getMarkingWithId));
            })
        );
    }

    removeOneById(id: string) {
        useMarkingsStore.getState().setMarkings(
            produce(state => {
                return state.filter(marking => marking.id !== id);
            })
        );
    }

    removeManyById(ids: string[]) {
        useMarkingsStore.getState().setMarkings(
            produce(state => {
                return state.filter(marking => !ids.includes(marking.id));
            })
        );
    }

    editOneById(id: string, newMarking: Partial<Marking>) {
        useMarkingsStore.getState().setMarkings(
            produce(state => {
                const index = state.findIndex(m => m.id === id);
                if (index === -1) throw new Error("Marking not found");

                // eslint-disable-next-line security/detect-object-injection
                Object.assign(state[index]!, newMarking);
            })
        );
    }

    bindOneById(id: string, boundMarkingId: string) {
        useMarkingsStore.getState().setMarkings(
            produce(() => {
                this.editOneById(id, { boundMarkingId });
            })
        );
    }
}

export const Markings = new MarkingsClass();
