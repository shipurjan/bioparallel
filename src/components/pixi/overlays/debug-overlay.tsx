import { Container } from "@pixi/react";
import { Grid } from "../app/debug/grid";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useGlobalViewport } from "../viewport/hooks/useGlobalViewport";
import { useGlobalApp } from "../app/hooks/useGlobalApp";
import { getViewportLocalPosition } from "./utils/get-viewport-local-position";

export type DebugOverlayProps = {
    canvasMetadata: CanvasMetadata;
};
export function DebugOverlay({ canvasMetadata: { id } }: DebugOverlayProps) {
    const viewport = useGlobalViewport(id, { autoUpdate: true });
    const app = useGlobalApp(id);

    if (viewport === null || app == null) {
        return null;
    }

    return (
        <Container position={getViewportLocalPosition(viewport)}>
            <Grid
                width={viewport.width}
                height={viewport.height}
                color="hsla(0, 50%, 50%, 0.5)"
                gridLinesCount={3}
            />
        </Container>
    );
}
