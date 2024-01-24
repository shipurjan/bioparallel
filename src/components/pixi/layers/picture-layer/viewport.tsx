"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Group, Layer } from "@pixi/layers";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Viewport } from "../pixi-viewport";

export type PictureLayerViewportProps = {
    children: ReactNode;
};

export const PictureLayerViewport = forwardRef<
    PixiViewport,
    PictureLayerViewportProps
>(({ children }: PictureLayerViewportProps, ref) => {
    const app = useApp();

    return (
        <Viewport
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

                const viewportLayer = new Layer(new Group(1, true));
                viewportLayer.addChild(viewportLayer);
                app.stage.addChild(viewportLayer);

                return viewport;
            }}
        >
            {children}
        </Viewport>
    );
});
