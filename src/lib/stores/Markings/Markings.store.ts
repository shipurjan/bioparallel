import { devtools } from "zustand/middleware";
import { ColorSource } from "pixi.js";
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { createWithEqualityFn } from "zustand/traditional";
// eslint-disable-next-line import/no-cycle
import { EmptyableMarking } from "@/components/information-tabs/markings-info/columns";
import { Immer, produceCallback } from "../immer.helpers";

export const enum MARKING_TYPES {
    POINT = "point",
    RAY = "ray",
}

export type InternalMarking = {
    id: string;
    hidden: boolean;
    label: number;
    position: {
        x: number;
        y: number;
    };
    backgroundColor: ColorSource;
    textColor: ColorSource;
    size: number;
    type: MARKING_TYPES;
    angleRad: number | null;
    boundMarkingId?: InternalMarking["id"] | undefined;
};

export type RenderableMarking = InternalMarking & {
    visible: boolean;
};

export type Marking = Omit<InternalMarking, "id" | "label"> &
    Partial<Pick<InternalMarking, "label">>;

type State = {
    markingsHash: string;
    markings: InternalMarking[];
    selectedMarking: EmptyableMarking | null;
    temporaryMarking: InternalMarking | null;
};

const INITIAL_STATE: State = {
    markingsHash: crypto.randomUUID(),
    temporaryMarking: null,
    selectedMarking: null,
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
