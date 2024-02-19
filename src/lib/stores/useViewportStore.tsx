import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ViewportSize = {
    screenWorldWidth: number;
    screenWorldHeight: number;
    worldWidth: number;
    worldHeight: number;
};

type ShallowViewportState = {
    size: ViewportSize;
    setSize: (size: ViewportSize) => void;
};

const createShallowViewportStore = (id: CanvasMetadata["id"]) =>
    create<ShallowViewportState>()(
        devtools(
            set => ({
                size: {
                    screenWorldHeight: 1,
                    screenWorldWidth: 1,
                    worldHeight: 1,
                    worldWidth: 1,
                },
                setSize: size => set({ size }),
            }),
            {
                name: id,
            }
        )
    );

const useLeftShallowViewportStore = createShallowViewportStore("left");
const useRightShallowViewportStore = createShallowViewportStore("right");

export const useShallowViewportStore = (id: CanvasMetadata["id"]) => {
    switch (id) {
        case "left":
            return useLeftShallowViewportStore;
        case "right":
            return useRightShallowViewportStore;
        default:
            throw new Error(`Invalid canvas id: ${id}`);
    }
};
