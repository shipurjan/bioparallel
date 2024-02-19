"use client";

import * as PIXI from "pixi.js";
import { Stage } from "@pixi/react";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import { useEffect, useState } from "react";
import { PixiApp } from "../app/app";
import { DebugOverlay } from "../overlays/debug-overlay";
import { MarkingOverlay } from "../overlays/marking-overlay";

function range(min: number, max: number): number[] {
    const len = max - min + 1;
    const arr = new Array(len);
    for (let i = 0; i < len; i += 1) {
        // eslint-disable-next-line security/detect-object-injection
        arr[i] = min + i;
    }
    return arr;
}

export type CanvasProps = Omit<Stage["props"], "children">;
export function Canvas({ options, ...props }: CanvasProps) {
    const canvasMetadata = useCanvasContext();
    const backgroundColor = getComputedStyle(document.body).getPropertyValue(
        "--background"
    );
    const [isFontLoaded, setIsFontLoaded] = useState(false);

    useEffect(() => {
        // wyłącz antyaliasing tekstur
        PIXI.BaseTexture.defaultOptions.scaleMode = 0;
        // załaduj bitmapowe czcionki, rozmiary 6-32 i 64
        const fontSizes = [...range(6, 32), 64];
        Promise.all(
            fontSizes.map(fontSize =>
                PIXI.Assets.load(`/fonts/Cousine/cousine${fontSize}.fnt`)
            )
        ).then(() => {
            setIsFontLoaded(true);
        });
    }, []);

    const defaultOptions: typeof options = {
        background: `hsl(${backgroundColor})`,
        antialias: true,
        autoDensity: true,
        autoStart: true,
        powerPreference: "high-performance",
        resolution: 1,
        ...options,
    };

    if (!isFontLoaded) return null;

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
