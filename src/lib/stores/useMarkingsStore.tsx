/* eslint-disable no-param-reassign */
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { produce } from "immer";
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
    boundMarking?: InternalMarking["id"];
};

export type RenderableMarking = InternalMarking & {
    visible: boolean;
};

export type Marking = Omit<InternalMarking, "id">;

type MarkingsState = {
    markings: InternalMarking[];
    temporaryMarking: InternalMarking | null;
    setTemporary: (temporaryMarking: Marking | null) => void;
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
        temporaryMarking: null,
        markings: [],
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
        add: markings =>
            set(
                produce((state: MarkingsState) => {
                    state.markings.push(
                        ...markings.map(marking => ({
                            id: idGen.next().value,
                            ...marking,
                        }))
                    );
                })
            ),
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
