import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

export type InternalMarking = {
    id: string;
    canvasId: CanvasMetadata["id"];
    position: {
        x: number;
        y: number;
    };
    size: number;
    boundMarking?: InternalMarking["id"];
};

export type Marking = Omit<InternalMarking, "id">;

type MarkingsState = {
    markings: InternalMarking[];
    add: (markings: Marking[]) => void;
    remove: (ids: string[]) => void;
    bind: (id: string, boundMarking: InternalMarking["id"]) => void;
};

function* idGenerator(): Generator<string> {
    const initialSymbols = "ABCDEFGHIJKLMNPQRSTUVWXYZαβΓδεζηλμπρΣτΦΩ";
    let index = 0;
    while (true) {
        // eslint-disable-next-line no-plusplus
        yield initialSymbols[index++] ?? String(index - initialSymbols.length);
    }
}

const idGen = idGenerator();

export const useMarkingsStore = createWithEqualityFn<MarkingsState>()(
    devtools(set => ({
        markings: [],
        add: markings =>
            set(state => ({
                markings: [
                    ...state.markings,
                    ...markings.map(marking => ({
                        id: idGen.next().value,
                        ...marking,
                    })),
                ],
            })),
        remove: ids =>
            set(state => ({
                markings: state.markings.filter(m => !ids.includes(m.id)),
            })),
        bind: (id, boundMarking) =>
            set(state => ({
                markings: state.markings.map(marking =>
                    marking.id === id ? { ...marking, boundMarking } : marking
                ),
            })),
    }))
);
