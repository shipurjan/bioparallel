"use client";

import * as PIXI from "pixi.js";
import { Stage } from "@pixi/react";
import { useCanvasContext } from "@/lib/hooks/useCanvasContext";
import { PixiApp } from "../app/app";

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
            <PixiApp
                width={props.width ?? 0}
                height={props.height ?? 0}
                canvasMetadata={canvasMetadata}
            />
        </Stage>
    );
}
