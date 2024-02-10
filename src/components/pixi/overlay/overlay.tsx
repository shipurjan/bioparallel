import { Container } from "@pixi/react";
import { Grid } from "../app/debug/grid";
import { useCanvas } from "../canvas/hooks/useCanvas";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";

export type OverlayProps = {
    canvasMetadata: CanvasMetadata;
};
export function Overlay({ canvasMetadata: { id } }: OverlayProps) {
    const {
        canvas: { viewport, app },
    } = useCanvas(id, { autoUpdate: true });

    if (viewport === null || app == null) {
        return null;
    }

    const position: [number, number] = [
        // eslint-disable-next-line no-underscore-dangle
        viewport.position.x + viewport._localBounds.minX * viewport.scale.x,
        // eslint-disable-next-line no-underscore-dangle
        viewport.position.y + viewport._localBounds.minY * viewport.scale.y,
    ];

    return (
        <Container position={position}>
            <Grid
                width={viewport.width}
                height={viewport.height}
                color="blue"
                gridLinesCount={2}
            />
        </Container>
    );
}
