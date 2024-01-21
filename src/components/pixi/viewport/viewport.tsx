"use client";

import { PixiComponent, useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import { ReactNode, forwardRef } from "react";

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

export type ViewportProps = Omit<PixiComponentViewportProps, "app">;
export const Viewport = forwardRef<PixiViewport, PixiViewportProps>(
    function Viewport({ ...props }: PixiViewportProps, ref) {
        const app = useApp();
        return <PixiViewportComponent ref={ref} app={app} {...props} />;
    }
);
