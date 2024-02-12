/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { createWithEqualityFn } from "zustand/traditional";

export interface UpdateState {
    value: {
        id: CanvasMetadata["id"];
        type: "viewport" | "app";
    } | null;
    update: (id: CanvasMetadata["id"], type: "viewport" | "app") => void;
}

function error<T>(a: T, b: T): boolean {
    // eslint-disable-next-line no-unused-expressions, no-sequences, no-void
    void a, b;
    throw new Error(
        "This compare function must be implemented outside of the store by comparing the id of canvas metadata"
    );
}

export const useUpdateStore = createWithEqualityFn<UpdateState>()(
    set => ({
        value: null,
        update: (id, type) =>
            set(() => ({
                value: { id, type },
            })),
    }),
    error
);
