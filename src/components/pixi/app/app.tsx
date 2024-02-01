"use client";

import { Graphics, useApp } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { useGlobalCanvasRef } from "@/lib/refs/pixi";
import { CanvasMetadata } from "@/lib/hooks/useCanvasContext";
import { useSettingsStore } from "@/lib/stores/useSettings";
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

    const { theme } = useSettingsStore(state => ({
        theme: state.settings.theme,
    }));
    useEffect(() => {
        const backgroundColor = getComputedStyle(
            document.body
        ).getPropertyValue("--background");
        app.renderer.background.color = `hsl(${backgroundColor})`;
    }, [app.renderer.background, theme]);

    const globalCanvasRef = useGlobalCanvasRef(id);
    const viewportRef = useRef<PixiViewport>(null);

    useEffect(() => {
        globalCanvasRef.app = app;
        globalCanvasRef.viewport = viewportRef.current;
    }, [app, globalCanvasRef]);

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
