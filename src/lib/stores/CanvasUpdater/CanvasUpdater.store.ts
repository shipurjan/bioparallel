import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { useThrottledUpdate } from "@/lib/hooks/useThrottledUpdate";
import { createWithEqualityFn } from "zustand/traditional";

type Update = {
    id: CanvasMetadata["id"];
    type: "viewport" | "app";
};

type State = {
    value: Update | null;
};

type Setters = {
    update: (id: Update["id"], type: Update["type"]) => void;
};

const INITIAL_STATE: State = {
    value: null,
};

const useUpdateStore = createWithEqualityFn<State & Setters>()(
    set => ({
        ...INITIAL_STATE,
        update: (id, type) => set({ value: { id, type } }),
    }),
    () => {
        throw new Error(
            "This compare function must be implemented outside of the store by comparing the id of canvas metadata"
        );
    }
);

const hasUpdateTypeOrIdChanged =
    (id: CanvasMetadata["id"], type: "app" | "viewport") =>
    (_oldValue: State["value"], newValue: State["value"]) => {
        if (newValue === null) return true;

        const { id: newId, type: newType } = newValue;
        return !(id === newId && type === newType);
    };

const useCanvasUpdater = (
    id: CanvasMetadata["id"],
    type: "app" | "viewport"
) => {
    return useUpdateStore(
        state => state.value,
        hasUpdateTypeOrIdChanged(id, type)
    );
};

const useThrottledCanvasUpdater = (fps: number) => {
    const delay = 1000 / fps;
    return useThrottledUpdate(delay);
};

const useDryCanvasUpdater = () => {
    return useUpdateStore(
        state => state.update,
        () => true
    );
};

export { useCanvasUpdater, useDryCanvasUpdater, useThrottledCanvasUpdater };
