import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { CanvasRef } from "@/lib/refs/pixi";
import { useEffect } from "react";
import { useCanvas } from "@/components/pixi/canvas/hooks/useCanvas";

export const useGlobalRefs = (
    id: CanvasMetadata["id"],
    app: CanvasRef["app"],
    viewport: CanvasRef["viewport"]
) => {
    const canvas = useCanvas(id, true);

    useEffect(() => {
        canvas.app = app;
        canvas.viewport = viewport;
    }, [app, canvas, viewport]);
};
