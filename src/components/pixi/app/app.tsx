"use client";

import { Graphics, useApp, useTick } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { useGlobalCanvasRef } from "@/refs/pixi";
import { CanvasMetadata } from "@/hooks/useCanvasContext";
import { Viewport } from "../viewport/viewport";

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
    const globalCanvasRef = useGlobalCanvasRef(id);
    const viewportRef = useRef<PixiViewport>(null);

    useTick(() => {
        globalCanvasRef.app = app;
        globalCanvasRef.viewport = viewportRef.current;
    });

    useEffect(() => {
        // Zmień rozdzielczość canvasa gdy użytkownik zmieni rozmiar okna
        if (viewportRef.current === null) return;
        const viewport = viewportRef.current;
        viewport.resize(width, height);
    }, [width, height]);

    const draw = useCallback((g: PixiGraphics) => {
        g.beginFill(0xffffff);
        g.drawCircle(100, 100, 60);
        g.endFill();
    }, []);

    return (
        <Viewport ref={viewportRef}>
            <Graphics draw={draw} />
        </Viewport>
    );
}
