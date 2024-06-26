import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { Immer, produceCallback } from "../immer.helpers";

type Settings = {
    texture: {
        scaleMode: "linear" | "nearest";
    };
    markings: {
        showLabels: boolean;
    };
    viewport: {
        showInformation: boolean;
    };
};

type State = {
    settings: Settings;
};

const INITIAL_STATE: State = {
    settings: {
        texture: {
            scaleMode: "nearest",
        },
        markings: {
            showLabels: true,
        },
        viewport: {
            showInformation: true,
        },
    },
};

const createStore = (id: CanvasMetadata["id"]) =>
    create<Immer<State>>()(
        devtools(
            set => ({
                ...INITIAL_STATE,
                set: callback => set(produceCallback(callback)),
                reset: () => set(INITIAL_STATE),
            }),
            { name: id }
        )
    );

export {
    createStore as _createCanvasToolbarStore,
    type State as CanvasToolbarState,
};
