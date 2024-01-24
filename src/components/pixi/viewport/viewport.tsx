"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { ReactPixiViewport } from "./react-pixi-viewport";

export type ViewportProps = {
    children: ReactNode;
};

export const Viewport = forwardRef<PixiViewport, ViewportProps>(
    ({ children }: ViewportProps, ref) => {
        const app = useApp();

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

                    return viewport;
                }}
            >
                {children}
            </ReactPixiViewport>
        );
    }
);
