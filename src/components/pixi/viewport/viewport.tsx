"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { ReactPixiViewport } from "./react-pixi-viewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useDryCanvasUpdater } from "../canvas/hooks/useCanvasUpdater";

export type ViewportProps = {
    children: ReactNode;
    canvasMetadata: CanvasMetadata;
};

export const Viewport = forwardRef<PixiViewport, ViewportProps>(
    ({ children, canvasMetadata }: ViewportProps, ref) => {
        const app = useApp();

        const updateCanvas = useDryCanvasUpdater();
        const eventCallback = () => {
            updateCanvas(canvasMetadata.id, "viewport");
        };

        return (
            <ReactPixiViewport
                ref={ref}
                options={{
                    events: app.renderer.events,
                    ticker: app.ticker,
                    threshold: 2,
                    passiveWheel: false,
                    allowPreserveDragOutside: true,
                }}
                sideEffects={viewport => {
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

                    viewport.addEventListener("frame-end", eventCallback, {
                        passive: true,
                    });

                    setTimeout(() => {
                        viewport.removeEventListener(
                            "frame-end",
                            eventCallback
                        );
                    }, app.ticker.deltaMS);

                    viewport.addEventListener("moved", eventCallback, {
                        passive: true,
                    });

                    return viewport;
                }}
            >
                {children}
            </ReactPixiViewport>
        );
    }
);
