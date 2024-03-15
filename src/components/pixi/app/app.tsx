/* eslint-disable security/detect-object-injection */

"use client";

import { useApp } from "@pixi/react";
import { useEffect, useRef } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { CanvasMetadata } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { normalizeSpriteSize } from "@/lib/utils/viewport/normalize-sprite-size";
import { loadSprite } from "@/lib/utils/viewport/load-sprite";
import { IS_DEV_ENVIRONMENT } from "@/lib/utils/const";
import { CanvasUpdater } from "@/lib/stores/CanvasUpdater";
import * as PIXI from "pixi.js";
import { GlobalSettingsStore } from "@/lib/stores/GlobalSettings";
import { Sprite } from "pixi.js";
import { Viewport } from "../viewport/viewport";
import { useThemeController } from "./hooks/useThemeController";
import { useGlobalRefs } from "./hooks/useGlobalRefs";
import { useViewportResizer } from "./hooks/useViewportResizer";

export type PixiAppProps = {
    width: number;
    height: number;
    canvasMetadata: CanvasMetadata;
};
export function PixiApp({ width, height, canvasMetadata }: PixiAppProps) {
    const spriteRef = useRef<Sprite>(null);
    const app = useApp();
    const viewportRef = useRef<PixiViewport>(null);
    const viewport = viewportRef.current;

    const updateCanvas = CanvasUpdater.useDry();

    useThemeController(app);
    useGlobalRefs(canvasMetadata.id, app, viewportRef.current);
    useViewportResizer(viewportRef.current, width, height);

    const scaleMode = GlobalSettingsStore.use(
        state => state.settings.video.rendering.scaleMode
    );

    useEffect(() => {
        const updateViewport = () =>
            updateCanvas(canvasMetadata.id, "viewport");
        PIXI.BaseTexture.defaultOptions.scaleMode = {
            nearest: PIXI.SCALE_MODES.NEAREST,
            linear: PIXI.SCALE_MODES.LINEAR,
        }[scaleMode];
        if (spriteRef.current === null) return;
        spriteRef.current.texture.baseTexture.scaleMode = {
            nearest: PIXI.SCALE_MODES.NEAREST,
            linear: PIXI.SCALE_MODES.LINEAR,
        }[scaleMode];
        updateViewport();
        viewport?.update(10);
    }, [canvasMetadata.id, scaleMode, updateCanvas, viewport]);

    useEffect(() => {
        if (!IS_DEV_ENVIRONMENT) return;
        if (viewport === null) return;

        const png01 =
            "C:/Users/niar-windows/Documents/repos/bioparallel/public/images/L1AC.png";
        const png02 =
            "C:/Users/niar-windows/Documents/repos/bioparallel/public/images/L2U.png";

        loadSprite(canvasMetadata.id === "left" ? png01 : png02)
            .then(sprite => {
                const normalizedSprite = normalizeSpriteSize(viewport, sprite);
                // @ts-expect-error it's fine
                spriteRef.current = normalizedSprite;
                viewport.addChild(normalizedSprite);
            })
            .catch(console.error);
    }, [canvasMetadata.id, viewport]);

    return <Viewport canvasMetadata={canvasMetadata} ref={viewportRef} />;
}
