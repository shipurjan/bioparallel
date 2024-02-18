"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import { Marking, useMarkingsStore } from "@/lib/stores/useMarkingsStore";
import { useShallowViewportStore } from "@/lib/stores/useShallowViewportStore";
import { ReactPixiViewport } from "./react-pixi-viewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useDryCanvasUpdater } from "../canvas/hooks/useCanvasUpdater";
import { getNormalizedPosition } from "../overlays/utils/get-viewport-local-position";

export type ViewportProps = {
    children: ReactNode;
    canvasMetadata: CanvasMetadata;
};

function getNormalizedClickPosition(
    event: FederatedPointerEvent,
    viewport: PixiViewport
) {
    return getNormalizedPosition(viewport, {
        x: event.screenX,
        y: event.screenY,
    });
}

export const Viewport = forwardRef<PixiViewport, ViewportProps>(
    ({ children, canvasMetadata: { id } }: ViewportProps, ref) => {
        const app = useApp();

        const updateCanvas = useDryCanvasUpdater();
        const updateViewport = () => {
            updateCanvas(id, "viewport");
        };

        let dragStartMousePos: null | {
            x: number;
            y: number;
        } = null;

        const addStoreMarking = useMarkingsStore(state => state.add);
        const setShallowViewportSize = useShallowViewportStore(id)(
            state => state.setSize
        );

        function addMarking(e: FederatedPointerEvent, viewport: PixiViewport) {
            if (dragStartMousePos === null) return;
            if (e.button !== 0) return;

            const diffX = Math.abs(e.pageX - dragStartMousePos.x);
            const diffY = Math.abs(e.pageY - dragStartMousePos.y);
            const DELTA = 3;

            if (diffX >= DELTA || diffY >= DELTA) return;

            const clickPos = getNormalizedClickPosition(e, viewport);

            if (clickPos === undefined) return;

            const marking: Marking =
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                {
                    canvasId: id,
                    size: 8,
                    position: {
                        x: clickPos.x,
                        y: clickPos.y,
                    },
                };
            addStoreMarking([marking]);
        }

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

                    viewport.addEventListener("frame-end", updateViewport, {
                        passive: true,
                    });

                    setTimeout(() => {
                        viewport.removeEventListener(
                            "frame-end",
                            updateViewport
                        );
                    }, app.ticker.deltaMS);

                    viewport.addEventListener("moved", updateViewport, {
                        passive: true,
                    });

                    viewport.addEventListener(
                        "zoomed",
                        () => {
                            setShallowViewportSize({
                                screenWorldHeight: viewport.screenWorldHeight,
                                screenWorldWidth: viewport.screenWorldWidth,
                                worldHeight: viewport.worldHeight,
                                worldWidth: viewport.worldWidth,
                            });
                        },
                        {
                            passive: true,
                        }
                    );

                    viewport.addEventListener("mousedown", e => {
                        dragStartMousePos = {
                            x: e.pageX,
                            y: e.pageY,
                        };
                    });

                    viewport.addEventListener(
                        "mouseup",
                        e => addMarking(e, viewport),
                        {
                            passive: true,
                        }
                    );

                    return viewport;
                }}
            >
                {children}
            </ReactPixiViewport>
        );
    }
);
