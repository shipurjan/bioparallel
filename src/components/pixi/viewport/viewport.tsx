/* eslint-disable no-underscore-dangle */

"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { CanvasUpdater } from "@/lib/stores/CanvasUpdater";
import { ReactPixiViewport } from "./react-pixi-viewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import {
    handleMouseDown,
    handleMouseUp,
    handleMove,
    handleOtherMove,
    handleZoom,
} from "./viewport.utils";

export type ViewportProps = {
    children?: ReactNode;
    canvasMetadata: CanvasMetadata;
};

export const Viewport = forwardRef<PixiViewport, ViewportProps>(
    ({ children, canvasMetadata: { id } }: ViewportProps, ref) => {
        const app = useApp();
        const updateCanvas = CanvasUpdater.useDry();
        const updateViewport = () => {
            updateCanvas(id, "viewport");
        };

        return (
            <ReactPixiViewport
                ref={ref}
                options={{
                    events: app.renderer.events,
                    ticker: app.ticker,
                    threshold: 0,
                    passiveWheel: false,
                    allowPreserveDragOutside: true,
                }}
                sideEffects={viewport => {
                    viewport
                        .drag({
                            wheel: true,
                            mouseButtons: "middle",
                        })
                        .wheel({
                            percent: 0,
                            interrupt: true,
                            wheelZoom: true,
                            keyToPress: ["ControlLeft", "ControlRight"],
                        })
                        .clampZoom({
                            minScale: 1 / 4,
                        });

                    viewport.on("frame-end", updateViewport);

                    setTimeout(() => {
                        viewport.off("frame-end", updateViewport);
                    }, app.ticker.deltaMS * 2);

                    viewport.on("moved", e =>
                        handleMove(e, viewport, id, updateViewport)
                    );

                    // @ts-expect-error - custom event arguments are not in the typings
                    viewport.addEventListener("other-moved", (e, delta) =>
                        handleOtherMove(e, delta, viewport, updateViewport)
                    );

                    viewport.addEventListener("zoomed", () => {
                        handleZoom(id, viewport);
                    });

                    viewport.addEventListener("mousedown", e => {
                        handleMouseDown(e, id, viewport);
                    });

                    viewport.addEventListener("mouseup", e => {
                        handleMouseUp(e, id, viewport);
                    });

                    return viewport;
                }}
            >
                {children}
            </ReactPixiViewport>
        );
    }
);
