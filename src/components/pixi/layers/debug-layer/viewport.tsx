"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Group, Layer } from "@pixi/layers";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Viewport } from "../pixi-viewport";

export type DebugLayerViewportProps = {
    children: ReactNode;
};
export const DebugLayerViewport = forwardRef<
    PixiViewport,
    DebugLayerViewportProps
>(({ children }: DebugLayerViewportProps, ref) => {
    const app = useApp();

    return (
        <Viewport
            ref={ref}
            options={{
                events: app.renderer.events,
                ticker: app.ticker,
                threshold: 2,
                passiveWheel: false,
            }}
            sideEffects={viewport => {
                // eslint-disable-next-line no-param-reassign
                viewport.eventMode = "none";

                const viewportLayer = new Layer(new Group(3, true));
                viewportLayer.addChild(viewportLayer);
                app.stage.addChild(viewportLayer);

                return viewport;
            }}
        >
            {children}
        </Viewport>
    );
});
