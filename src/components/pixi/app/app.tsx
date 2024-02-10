"use client";

import { Graphics, useApp } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { Viewport } from "../viewport/viewport";
import { useThemeController } from "./hooks/useThemeController";
import { useGlobalRefs } from "./hooks/useGlobalRefs";
import { useViewportResizer } from "./hooks/useViewportResizer";

export type PixiAppProps = {
    width: number;
    height: number;
    canvasMetadata: CanvasMetadata;
};
export function PixiApp({
    width,
    height,
    canvasMetadata: { id },
}: PixiAppProps) {
    const app = useApp();
    const viewportRef = useRef<PixiViewport>(null);

    const colors = useThemeController(app);
    useGlobalRefs(id, app, viewportRef.current);
    useViewportResizer(viewportRef.current, width, height);

    const draw = useCallback(
        (g: PixiGraphics) => {
            g.clear();
            g.beginFill(colors.foreground);
            g.drawCircle(100, 100, 60);
            g.drawCircle(200, 250, 50);
            g.endFill();
            viewportRef.current?.resize(width, height);
        },
        [colors.foreground, height, width]
    );

    return (
        <Viewport ref={viewportRef}>
            <Graphics draw={draw} />
        </Viewport>
    );
}
