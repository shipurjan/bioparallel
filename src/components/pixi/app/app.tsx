"use client";

import { Graphics, useApp, useTick } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { GLOBAL } from "@/refs/pixi";
import { Viewport } from "../viewport/viewport";

export type PixiAppProps = {
    width: number;
    height: number;
};
export function PixiApp({ width, height }: PixiAppProps) {
    const app = useApp();
    const viewportRef = useRef<PixiViewport>(null);

    useTick(() => {
        GLOBAL.app = app;
        GLOBAL.viewport = viewportRef.current;
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
