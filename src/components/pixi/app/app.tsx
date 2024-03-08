"use client";

import { useApp } from "@pixi/react";
import { useCallback, useEffect, useRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { normalizeSpriteSize } from "@/lib/utils/viewport/normalize-sprite-size";
import { loadSprite } from "@/lib/utils/viewport/load-sprite";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import { CanvasUpdater } from "@/lib/stores/CanvasUpdater";
import { Viewport } from "../viewport/viewport";
import { useThemeController } from "./hooks/useThemeController";
import { useGlobalRefs } from "./hooks/useGlobalRefs";
import { useViewportResizer } from "./hooks/useViewportResizer";

export type PixiAppProps = {
    width: number;
    height: number;
    canvasMetadata: CanvasMetadata;
};
export function PixiApp({ width, height, canvasMetadata }: PixiAppProps) {
    const app = useApp();
    const viewportRef = useRef<PixiViewport>(null);
    const viewport = viewportRef.current;

    const updateCanvas = CanvasUpdater.useDry();
    const updateViewport = useCallback(() => {
        updateCanvas(canvasMetadata.id, "viewport");
    }, [canvasMetadata.id, updateCanvas]);

    useThemeController(app);
    useGlobalRefs(canvasMetadata.id, app, viewportRef.current);
    useViewportResizer(viewportRef.current, width, height);

    useEffect(() => {}, [app.renderer.background]);

    useEffect(() => {
        if (!IS_DEV_ENVIRONMENT) return;
        if (viewport === null) return;

        const png01 =
            "C:/Users/niar-windows/Documents/repos/bioparallel/public/images/L1AC.png";
        const png02 =
            "C:/Users/niar-windows/Documents/repos/bioparallel/public/images/L2U.png";

        loadSprite(canvasMetadata.id === "left" ? png01 : png02)
            .then(sprite => {
                viewport.addChild(normalizeSpriteSize(viewport, sprite));
                updateViewport();
            })
            .catch(console.error);
    }, [canvasMetadata.id, updateViewport, viewport]);

    return <Viewport canvasMetadata={canvasMetadata} ref={viewportRef} />;
}
