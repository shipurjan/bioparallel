"use client";

import { Graphics } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useEffect } from "react";
import * as PIXI from "pixi.js";
import { useTheme } from "next-themes";

export type CanvasProps = {
    viewport: PixiViewport;
    app: PIXI.Application<PIXI.ICanvas>;
    theme: ReturnType<typeof useTheme>;
};
export function Canvas({ viewport, app, theme }: CanvasProps) {
    // eslint-disable-next-line no-void
    void viewport;

    useEffect(() => {
        const style = getComputedStyle(document.body);
        const backgroundHSL = style.getPropertyValue("--background");
        const backgroundColor = `hsl(${backgroundHSL})`;

        // eslint-disable-next-line no-param-reassign
        app.renderer.background.color = backgroundColor;
    }, [app.renderer.background, theme.resolvedTheme]);

    const draw = useCallback(
        (g: PixiGraphics) => {
            g.beginFill(
                theme.resolvedTheme === "dark" ? 0xffffff : 0x000000,
                1
            );
            g.drawCircle(0, 0, 60);
            g.endFill();
        },
        [theme.resolvedTheme]
    );

    return <Graphics draw={draw} />;
}
