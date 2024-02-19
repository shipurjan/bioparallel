/* eslint-disable no-underscore-dangle */

"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import { Marking, useMarkingsStore } from "@/lib/stores/useMarkingsStore";
import { useShallowViewportStore } from "@/lib/stores/useViewportStore";
import { useGlobalToolbarStore } from "@/lib/stores/useToolbarStore";
import { MovedEvent } from "pixi-viewport/dist/types";
import { ReactPixiViewport } from "./react-pixi-viewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useDryCanvasUpdater } from "../canvas/hooks/useCanvasUpdater";
import { getNormalizedPosition } from "../overlays/utils/get-viewport-local-position";
import { useGlobalViewport } from "./hooks/useGlobalViewport";

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

type Position = {
    x: number;
    y: number;
};
type ZoomValue = number;
type Zoom = {
    value: ZoomValue;
    offset: Position;
};
type Delta = Zoom | Position | null;
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
            const DELTA = 10;

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

        let prevScaled: ZoomValue = 1;
        let prevPos: Position = { x: 0, y: 0 };

        const followLockedViewport = (
            viewport: PixiViewport,
            event: MovedEvent,
            delta: Delta
        ) => {
            switch (event.type) {
                case "drag": {
                    const { x, y } = delta as Position;
                    viewport.moveCorner(
                        viewport.corner.x - x,
                        viewport.corner.y - y
                    );
                    break;
                }
                case "wheel": {
                    const {
                        value,
                        offset: { x, y },
                    } = delta as Zoom;
                    // FIXME: złe przesunięcie na zoomie
                    viewport.moveCenter(
                        viewport.center.x - x,
                        viewport.center.y - y
                    );
                    // eslint-disable-next-line no-param-reassign
                    viewport.setZoom(viewport.scaled * value);
                    break;
                }
                default:
                    break;
            }

            updateViewport();

            prevScaled = viewport.scaled;
            prevPos = {
                x: viewport.position._x,
                y: viewport.position._y,
            };
        };

        return (
            <ReactPixiViewport
                ref={ref}
                options={{
                    events: app.renderer.events,
                    ticker: app.ticker,
                    threshold: 10,
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

                    viewport.addEventListener("moved", e => {
                        updateViewport();

                        const isLocked =
                            useGlobalToolbarStore.getState().settings
                                .lockedViewport;
                        if (!isLocked) {
                            prevScaled = viewport.scaled;
                            prevPos = {
                                x: viewport.position._x,
                                y: viewport.position._y,
                            };
                        }
                        if (isLocked) {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const oppositeViewport = useGlobalViewport(
                                id === "left" ? "right" : "left"
                            );

                            const delta: Delta = (() => {
                                switch (e.type) {
                                    case "drag":
                                        return {
                                            x:
                                                (viewport.position._x -
                                                    prevPos.x) /
                                                viewport.scaled,
                                            y:
                                                (viewport.position._y -
                                                    prevPos.y) /
                                                viewport.scaled,
                                        };
                                    case "wheel":
                                        return {
                                            value: viewport.scaled / prevScaled,
                                            offset: {
                                                x:
                                                    (viewport.position._x -
                                                        prevPos.x) /
                                                    viewport.scaled,
                                                y:
                                                    (viewport.position._y -
                                                        prevPos.y) /
                                                    viewport.scaled,
                                            },
                                        };
                                    default:
                                        return null;
                                }
                            })();

                            prevScaled = viewport.scaled;
                            prevPos = {
                                x: viewport.position._x,
                                y: viewport.position._y,
                            };

                            oppositeViewport?.emit("other-moved", e, delta);
                        }
                    });

                    // @ts-expect-error - custom event arguments are not in the typings
                    viewport.addEventListener(
                        "other-moved",
                        (e: Event, delta: Delta) => {
                            followLockedViewport(
                                viewport,
                                e as unknown as MovedEvent,
                                delta
                            );
                        }
                    );

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
