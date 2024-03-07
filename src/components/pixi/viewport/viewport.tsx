/* eslint-disable no-underscore-dangle */

"use client";

import { useApp } from "@pixi/react";
import { ReactNode, forwardRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { FederatedPointerEvent } from "pixi.js";
import { Marking, useMarkingsStore } from "@/lib/stores/useMarkingsStore";
import { useShallowViewportStore } from "@/lib/stores/useViewportStore";
import { Toolbar } from "@/lib/stores/useToolbarStore";
import { MovedEvent } from "pixi-viewport/dist/types";
import { round } from "@/lib/utils/math/round";
import { ReactPixiViewport } from "./react-pixi-viewport";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useDryCanvasUpdater } from "../canvas/hooks/useCanvasUpdater";
import { getNormalizedPosition } from "../overlays/utils/get-viewport-local-position";
import { useGlobalViewport } from "./hooks/useGlobalViewport";

export type ViewportProps = {
    children?: ReactNode;
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

        const { addStoreMarking, setTemporaryStoreMarking } = useMarkingsStore(
            state => ({
                addStoreMarking: state.add,
                setTemporaryStoreMarking: state.setTemporary,
            })
        );
        const { setSize: setShallowViewportSize } = useShallowViewportStore(id)(
            state => ({
                setSize: state.setSize,
            })
        );

        function setTemporaryMarking(
            e: FederatedPointerEvent,
            viewport: PixiViewport
        ) {
            const clickPos = getNormalizedClickPosition(e, viewport);
            if (clickPos === undefined) return;

            const marking: Marking = {
                canvasId: id,
                size: Toolbar.settings.marking.size,
                position: {
                    x: clickPos.x,
                    y: clickPos.y,
                },
                backgroundColor: Toolbar.settings.marking.backgroundColor,
                textColor: Toolbar.settings.marking.textColor,
                type: "point",
                angle: 0,
            };

            setTemporaryStoreMarking(marking);
        }

        function addMarking(e: FederatedPointerEvent, viewport: PixiViewport) {
            const clickPos = getNormalizedClickPosition(e, viewport);
            if (clickPos === undefined) return;

            const marking: Marking = {
                canvasId: id,
                size: Toolbar.settings.marking.size,
                position: {
                    x: clickPos.x,
                    y: clickPos.y,
                },
                backgroundColor: Toolbar.settings.marking.backgroundColor,
                textColor: Toolbar.settings.marking.textColor,
                type: "point",
                angle: 0,
            };

            addStoreMarking([marking]);
        }

        let prevScaled: ZoomValue = 1;
        let prevPos: Position = { x: 0, y: 0 };

        let prevOppositeScaled: ZoomValue = 1;

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

                    const oldScale = viewport.scaled;
                    const newScale = round(oldScale * value, 3);

                    if (newScale !== prevOppositeScaled) {
                        viewport.setZoom(newScale);

                        viewport.moveCorner(
                            viewport.corner.x - x,
                            viewport.corner.y - y
                        );
                    }

                    viewport.emit("zoomed", {
                        type: "wheel",
                        viewport,
                    });

                    prevOppositeScaled = newScale;
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

                        const isLocked = Toolbar.settings.viewport.locked;
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

                            if (oppositeViewport === null) return;

                            const delta: Delta = (() => {
                                switch (e.type) {
                                    case "drag": {
                                        const isScaleSync =
                                            Toolbar.settings.viewport.scaleSync;
                                        return {
                                            x:
                                                (viewport.position._x -
                                                    prevPos.x) /
                                                (isScaleSync
                                                    ? viewport.scaled
                                                    : oppositeViewport.scaled),
                                            y:
                                                (viewport.position._y -
                                                    prevPos.y) /
                                                (isScaleSync
                                                    ? viewport.scaled
                                                    : oppositeViewport.scaled),
                                        };
                                    }
                                    case "wheel": {
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
                                    }
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

                    viewport.addEventListener(
                        "mousemove",
                        e => {
                            if (e.buttons !== 1) return;
                            const cursorMode =
                                Toolbar.settings.cursorMode.state;
                            if (cursorMode === "marking") {
                                setTemporaryMarking(e, viewport);
                            }
                        },
                        {
                            passive: true,
                        }
                    );

                    viewport.addEventListener(
                        "mouseup",
                        e => {
                            if (e.button !== 0) return;
                            const cursorMode =
                                Toolbar.settings.cursorMode.state;
                            if (cursorMode === "marking") {
                                addMarking(e, viewport);
                                setTemporaryStoreMarking(null);
                            }
                        },
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
