/* eslint-disable no-underscore-dangle */

"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { CanvasUpdater } from "@/lib/stores/CanvasUpdater";
import { CachedViewportStore } from "@/lib/stores/CachedViewport";
import { MarkingsStore } from "@/lib/stores/Markings";
import { ReactPixiViewport } from "./react-pixi-viewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { ViewportHandlerParams } from "./event-handlers/utils";
import { handleMove, handleOppositeMove, handleZoom } from "./event-handlers";
import { composeObservables } from "./observables/composeObservables";

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

                    viewport.on("childAdded", updateViewport);
                    viewport.on("childRemoved", updateViewport);
                    viewport.on("frame-end", updateViewport);

                    setTimeout(() => {
                        viewport.off("frame-end", updateViewport);
                    }, app.ticker.deltaMS * 2);

                    const handlerParams: ViewportHandlerParams = {
                        viewport,
                        id,
                        updateViewport,
                        cachedViewportStore: CachedViewportStore(id),
                        markingsStore: MarkingsStore(id),
                    };

                    viewport.on("moved", e => {
                        handleMove(e, handlerParams);
                    });

                    viewport.on("opposite-moved", (e, delta) => {
                        handleOppositeMove(e, handlerParams, delta);
                    });

                    viewport.on("zoomed", e => {
                        handleZoom(e, handlerParams);
                    });

                    composeObservables(viewport, handlerParams);

                    // eslint-disable-next-line no-param-reassign
                    viewport.name = id;

                    return viewport;
                }}
            >
                {children}
            </ReactPixiViewport>
        );
    }
);
