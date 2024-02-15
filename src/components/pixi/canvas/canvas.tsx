"use client";

import * as PIXI from "pixi.js";
import { Stage } from "@pixi/react";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import { PixiApp } from "../app/app";
import { DebugOverlay } from "../overlays/debug-overlay";
import { MarkingOverlay } from "../overlays/marking-overlay";

export type CanvasProps = Omit<Stage["props"], "children">;
export function Canvas({ options, ...props }: CanvasProps) {
    const canvasMetadata = useCanvasContext();
    const backgroundColor = getComputedStyle(document.body).getPropertyValue(
        "--background"
    );

    PIXI.BaseTexture.defaultOptions.scaleMode = 0;

    const defaultOptions: typeof options = {
        background: `hsl(${backgroundColor})`,
        antialias: true,
        autoDensity: true,
        autoStart: true,
        powerPreference: "high-performance",
        resolution: 1,
        ...options,
    };

    return (
        <Stage {...props} options={defaultOptions}>
            {IS_DEV_ENVIRONMENT && (
                <DebugOverlay canvasMetadata={canvasMetadata} />
            )}
            <PixiApp
                width={props.width ?? 0}
                height={props.height ?? 0}
                canvasMetadata={canvasMetadata}
            />
            <MarkingOverlay canvasMetadata={canvasMetadata} />
        </Stage>
    );
}
