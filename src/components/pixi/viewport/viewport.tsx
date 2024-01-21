"use client";

import { PixiComponent, useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import { ReactNode, useRef } from "react";
import { useTheme } from "next-themes";
import { Canvas } from "../canvas/canvas";

export type PixiViewportProps = {
    children: ReactNode;
};

export type PixiComponentViewportProps = PixiViewportProps & {
    app: PIXI.Application;
};

const PixiViewportComponent = PixiComponent("Viewport", {
    create: ({ app }: PixiComponentViewportProps) => {
        const events = new PIXI.EventSystem(app.renderer);
        events.domElement = app.renderer.view as HTMLCanvasElement;

        const viewport = new PixiViewport({
            events: app.renderer.events,
            ticker: app.ticker,
            threshold: 2,
            passiveWheel: false,
            allowPreserveDragOutside: true,
        });

        viewport
            .drag({
                wheel: false,
                mouseButtons: "middle-left",
            })
            .wheel({
                percent: 0,
                interrupt: true,
                wheelZoom: true,
            })
            .clampZoom({
                minScale: 1 / 4,
            });

        return viewport;
    },
    willUnmount: (viewport: PixiViewport) => {
        // eslint-disable-next-line no-param-reassign
        viewport.options.noTicker = true;
        viewport.destroy({ children: true });
    },
});

export type ViewportProps = {
    theme: ReturnType<typeof useTheme>;
};
export function Viewport({ theme }: ViewportProps) {
    const app = useApp();
    const viewportRef = useRef<PixiViewport>(null);

    return (
        <PixiViewportComponent ref={viewportRef} app={app}>
            {viewportRef.current !== null && (
                <Canvas
                    viewport={viewportRef.current}
                    app={app}
                    theme={theme}
                />
            )}
        </PixiViewportComponent>
    );
}
