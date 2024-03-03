import { UpdateState, useUpdateStore } from "@/lib/stores/useCanvasStore";
import { useThrottledUpdate } from "@/lib/hooks/useThrottledUpdate";
import { CanvasMetadata } from "./useCanvasContext";

const typeChecker =
    (id: CanvasMetadata["id"], type: "app" | "viewport") =>
    (_oldValue: UpdateState["value"], newValue: UpdateState["value"]) => {
        if (newValue === null) return true;
        const { id: newId, type: newType } = newValue;

        return !(id === newId && type === newType);
    };

export const useCanvasUpdater = (
    id: CanvasMetadata["id"],
    type: "app" | "viewport"
) => {
    return useUpdateStore(state => state.value, typeChecker(id, type));
};

export const useThrottledCanvasUpdater = (fps: number) => {
    const delay = 1000 / fps;
    return useThrottledUpdate(delay);
};

const voidCompare = <T,>(a: T, b: T): boolean => {
    // eslint-disable-next-line no-unused-expressions, no-sequences, no-void
    void a, b;
    return true;
};

export const useDryCanvasUpdater = () => {
    return useUpdateStore(state => state.update, voidCompare);
};
