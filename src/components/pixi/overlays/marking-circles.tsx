/* eslint-disable react/prop-types */
import { InternalMarking } from "@/lib/stores/useMarkingsStore";
import { Graphics } from "@pixi/react";
import { memo } from "react";
import { Graphics as PixiGraphics } from "pixi.js";
import { Viewport } from "pixi-viewport";

export type MarkingCirclesProps = {
    markings: InternalMarking[];
    viewport: Viewport;
};
export const MarkingCircles = memo(
    ({ markings, viewport }: MarkingCirclesProps) => {
        const draw = (g: PixiGraphics) => {
            // wyrenderuj wszystkie markingi jako jedna grafika dla lepszej wydajności
            g.clear();
            if (viewport !== null) {
                markings.forEach(marking => {
                    g.beginFill("0xff0000");
                    const { x, y } = marking.position;
                    g.drawCircle(x, y, marking.size);
                    g.endFill();
                });
            }
        };

        return <Graphics draw={draw} />;
    }
);
