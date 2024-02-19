import { Container } from "@pixi/react";
import { useMarkingsStore } from "@/lib/stores/useMarkingsStore";
import { useShallowViewportStore } from "@/lib/stores/useViewportStore";
import { useMemo } from "react";
import { CanvasMetadata } from "../canvas/hooks/useCanvasContext";
import { useGlobalViewport } from "../viewport/hooks/useGlobalViewport";
import { useGlobalApp } from "../app/hooks/useGlobalApp";
import { getViewportLocalPosition } from "./utils/get-viewport-local-position";
import { MarkingTexts } from "./marking-texts";
import { MarkingCircles } from "./marking-circles";

export type MarkingOverlayProps = {
    canvasMetadata: CanvasMetadata;
};

export function MarkingOverlay({
    canvasMetadata: { id },
}: MarkingOverlayProps) {
    const viewport = useGlobalViewport(id, { autoUpdate: true });
    const app = useGlobalApp(id);
    const { markings } = useMarkingsStore(
        ({ markings: markingList }) => ({
            markings: markingList.filter(m => m.canvasId === id),
        }),
        (oldMarkings, newMarkings) =>
            oldMarkings.markings.length === newMarkings.markings.length
    );

    // oblicz proporcje viewportu do świata tylko na evencie zoomed, dla lepszej wydajności (nie ma sensu liczyć tego na każdym renderze
    // bo przy samym ruchu nie zmieniają się proporcje viewportu do świata, tylko przy zoomie)
    const { viewportWidthRatio, viewportHeightRatio } = useShallowViewportStore(
        id
    )(
        ({
            size: {
                screenWorldWidth,
                screenWorldHeight,
                worldWidth,
                worldHeight,
            },
        }) => ({
            viewportWidthRatio: screenWorldWidth / worldWidth,
            viewportHeightRatio: screenWorldHeight / worldHeight,
        })
    );

    const relativeMarkings = useMemo(
        () =>
            markings.map(marking => ({
                ...marking,
                position:
                    viewport === null
                        ? marking.position
                        : {
                              x: marking.position.x * viewportWidthRatio,
                              y: marking.position.y * viewportHeightRatio,
                          },
            })),
        [markings, viewport, viewportHeightRatio, viewportWidthRatio]
    );

    if (viewport === null || app == null) {
        return null;
    }

    return (
        <Container position={getViewportLocalPosition(viewport)}>
            <MarkingCircles markings={relativeMarkings} viewport={viewport} />
            <MarkingTexts markings={relativeMarkings} />
        </Container>
    );
}
