import { Graphics, Stage } from "@pixi/react";
import { PictureLayerViewport } from "@/components/pixi/layers/picture-layer/viewport";
import { MarkerLayerViewport } from "@/components/pixi/layers/marker-layer/viewport";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useRef, useState } from "react";
import { Viewport } from "pixi-viewport";
import { isDevEnvironment } from "@/lib/utils";
import { useKeyDown } from "@/hooks/useKeyDown";
import { DebugLayerViewport } from "../layers/debug-layer/viewport";
import { DebugLayerComponent } from "../layers/debug-layer/component";

export type CanvasProps = Omit<Stage["props"], "children">;
export function Canvas({ options, ...props }: CanvasProps) {
    const [isDebugInfo, setIsDebugInfo] = useState(isDevEnvironment);
    useKeyDown(() => {
        if (isDevEnvironment) {
            setIsDebugInfo(s => !s);
        }
    }, ["h"]);

    const markerViewportRef = useRef<Viewport>(null);
    const pictureViewportRef = useRef<Viewport>(null);

    const backgroundColor = getComputedStyle(document.body).getPropertyValue(
        "--background"
    );
    const defaultOptions: typeof options = {
        background: `hsl(${backgroundColor})`,
        antialias: true,
        autoDensity: true,
        autoStart: true,
        powerPreference: "high-performance",
        resolution: 1,
        ...options,
    };

    const draw = useCallback((g: PixiGraphics) => {
        g.beginFill(0xffffff);
        g.drawCircle(100, 100, 60);
        g.endFill();
    }, []);

    return (
        <Stage {...props} options={defaultOptions}>
            <MarkerLayerViewport ref={markerViewportRef}>
                <Graphics draw={draw} />
            </MarkerLayerViewport>
            <PictureLayerViewport ref={pictureViewportRef}>
                <Graphics draw={draw} />
            </PictureLayerViewport>
            <DebugLayerViewport>
                {isDevEnvironment &&
                    isDebugInfo &&
                    pictureViewportRef.current !== null && (
                        <DebugLayerComponent
                            viewport={pictureViewportRef.current}
                        />
                    )}
            </DebugLayerViewport>
        </Stage>
    );
}
