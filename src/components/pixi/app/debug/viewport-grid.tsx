import { Graphics } from "@pixi/react";
import { Viewport } from "pixi-viewport";
import { ColorSource, Graphics as PixiGraphics } from "pixi.js";
import { useCallback } from "react";

function drawGrid(
    g: PixiGraphics,
    color: ColorSource,
    gridCount: number,
    width: number,
    height: number
) {
    g.lineStyle(2, color).drawRect(0, 0, width, height).lineStyle(1, color);
    for (let i = 1; i < gridCount; i += 1) {
        g.moveTo((i * width) / gridCount, 0)
            .lineTo((i * width) / gridCount, height)
            .moveTo(0, (i * height) / gridCount)
            .lineTo(width, (i * height) / gridCount);
    }
}

export type ViewportGridProps = {
    viewport: Viewport;
};
export function ViewportGrid({ viewport }: ViewportGridProps) {
    const draw = useCallback(
        (g: PixiGraphics) => {
            g.clear();
            const GRID_LINES = 4;
            drawGrid(
                g,
                "red",
                GRID_LINES,
                // eslint-disable-next-line no-underscore-dangle
                viewport.screenWidth,
                // eslint-disable-next-line no-underscore-dangle
                viewport.screenHeight
            );
        },
        // eslint-disable-next-line no-underscore-dangle
        [viewport.screenHeight, viewport.screenWidth]
    );

    return <Graphics draw={draw} />;
}
