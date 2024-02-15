import { Container, Graphics } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useGlobalViewport } from "../viewport/hooks/useGlobalViewport";
import { useGlobalApp } from "../app/hooks/useGlobalApp";
import {
    getRelativePosition,
    getViewportLocalPosition,
} from "./utils/get-viewport-local-position";

export type MarkingOverlayProps = {
    canvasMetadata: CanvasMetadata;
};
export function MarkingOverlay({
    canvasMetadata: { id },
}: MarkingOverlayProps) {
    const viewport = useGlobalViewport(id, { autoUpdate: true });
    const app = useGlobalApp(id);

    const draw = (g: PixiGraphics) => {
        g.clear();
        g.beginFill("0xff0000");
        if (viewport !== null) {
            const pos1 = getRelativePosition(viewport, [50, 60]);
            g.drawCircle(pos1[0], pos1[1], 3);
            const pos2 = getRelativePosition(viewport, [100, 100]);
            g.drawCircle(pos2[0], pos2[1], 3);
        }
        g.endFill();
    };

    if (viewport === null || app == null) {
        return null;
    }

    return (
        <Container position={getViewportLocalPosition(viewport)}>
            <Graphics draw={draw} />
        </Container>
    );
}
