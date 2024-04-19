import { devtools } from "zustand/middleware";
import { ColorSource } from "pixi.js";
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { createWithEqualityFn } from "zustand/traditional";
import { Immer, produceCallback } from "../immer.helpers";

export const enum MARKING_TYPES {
    POINT = "point",
    RAY = "ray",
}

export type InternalMarking = {
    id: string;
    selected: boolean;
    hidden: boolean;
    label: string;
    position: {
        x: number;
        y: number;
    };
    backgroundColor: ColorSource;
    textColor: ColorSource;
    size: number;
    type: MARKING_TYPES;
    angleRad: number | null;
    boundMarkingId?: InternalMarking["id"];
};

export type RenderableMarking = InternalMarking & {
    visible: boolean;
};

export type SimplifiedTableRow = {
    id: string;
    index: number;
    marking: {
        boundMarkingId?: InternalMarking["boundMarkingId"];
        id?: InternalMarking["id"];
    };
};

export type Marking = Omit<InternalMarking, "id" | "label"> &
    Partial<Pick<InternalMarking, "label">>;

type Cursor = {
    rowIndex: number;
    id?: InternalMarking["id"];
    boundMarkingId?: InternalMarking["boundMarkingId"];
};

type State = {
    cursor: Cursor;
    tableRows: SimplifiedTableRow[];
    markingsHash: string;
    markings: InternalMarking[];
    temporaryMarking: InternalMarking | null;
};

const INITIAL_STATE: State = {
    cursor: { rowIndex: Infinity },
    tableRows: [],
    markingsHash: crypto.randomUUID(),
    temporaryMarking: null,
    markings: [],
};

const createStore = (id: CanvasMetadata["id"]) =>
    createWithEqualityFn<Immer<State>>()(
        devtools(
            set => ({
                ...INITIAL_STATE,
                set: callback => set(produceCallback(callback)),
                reset: () => set(INITIAL_STATE),
            }),
            { name: id }
        )
    );

export { createStore as _createMarkingsStore, type State as MarkingsState };
