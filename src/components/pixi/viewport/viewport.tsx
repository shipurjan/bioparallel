/* eslint-disable no-underscore-dangle */

"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { CanvasUpdater } from "@/lib/stores/CanvasUpdater";
import { CachedViewportStore } from "@/lib/stores/CachedViewport";
import { ReactPixiViewport } from "./react-pixi-viewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import {
    ViewportHandlerParams,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMove,
    handleOtherMove as handleOppositeMove,
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

                    const handlerParams: ViewportHandlerParams = {
                        viewport,
                        id,
                        updateViewport,
                        store: CachedViewportStore(id),
                    };

                    viewport.on("moved", e => handleMove(e, handlerParams));

                    viewport.on("opposite-moved", (e, delta) =>
                        handleOppositeMove(e, handlerParams, delta)
                    );

                    viewport.on("zoomed", e => {
                        handleZoom(e, handlerParams);
                    });

                    viewport.on("mousedown", e => {
                        handleMouseDown(e, handlerParams);
                    });

                    viewport.on("mouseup", e => {
                        handleMouseUp(e, handlerParams);
                    });

                    viewport.on("mouseleave", e => {
                        handleMouseLeave(e, handlerParams);
                    });

                    return viewport;
                }}
            >
                {children}
            </ReactPixiViewport>
        );
    }
);
