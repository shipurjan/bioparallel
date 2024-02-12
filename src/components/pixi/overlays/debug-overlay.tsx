import { Container } from "@pixi/react";
import { Grid } from "../app/debug/grid";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useGlobalViewport } from "../viewport/hooks/useGlobalViewport";
import { useGlobalApp } from "../app/hooks/useGlobalApp";

export type OverlayProps = {
    canvasMetadata: CanvasMetadata;
};
export function DebugOverlay({ canvasMetadata: { id } }: OverlayProps) {
    const viewport = useGlobalViewport(id, { autoUpdate: true });
    const app = useGlobalApp(id);

    if (viewport === null || app == null) {
        return null;
    }

    const childrenPosition: [number, number] = [
        // eslint-disable-next-line no-underscore-dangle
        viewport.position.x + viewport._localBounds.minX * viewport.scale.x,
        // eslint-disable-next-line no-underscore-dangle
        viewport.position.y + viewport._localBounds.minY * viewport.scale.y,
    ];

    return (
        <Container position={childrenPosition}>
            <Grid
                width={viewport.width}
                height={viewport.height}
                color="hsla(0, 50%, 50%, 0.5)"
                gridLinesCount={2}
            />
            <Grid
                width={viewport.screenWorldWidth}
                height={viewport.screenWorldHeight}
                color="hsla(90, 50%, 50%, 0.5)"
                gridLinesCount={3}
            />
        </Container>
    );
}
