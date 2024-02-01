import { CanvasMetadata } from "@/lib/hooks/useCanvasContext";
import { GlobalCanvasRef, useGlobalCanvasRef } from "@/lib/refs/pixi";
import { useEffect } from "react";

export const useGlobalRefs = (
    id: CanvasMetadata["id"],
    app: GlobalCanvasRef["app"],
    viewport: GlobalCanvasRef["viewport"]
) => {
    const globalCanvasRef = useGlobalCanvasRef(id);

    useEffect(() => {
        globalCanvasRef.app = app;
        globalCanvasRef.viewport = viewport;
    }, [app, globalCanvasRef, viewport]);
};
