/* eslint-disable sonarjs/prefer-single-boolean-return */
/* eslint-disable react/prop-types */
import {
    InternalMarking,
    RenderableMarking,
} from "@/lib/stores/useMarkingsStore";
import { BitmapText, Graphics } from "@pixi/react";
import { Application, ICanvas, Graphics as PixiGraphics } from "pixi.js";
import { memo, useCallback, useEffect, useState } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Global } from "@/lib/stores/useGlobalSettingsStore";
import { useGlobalViewport } from "../../viewport/hooks/useGlobalViewport";
import { CanvasMetadata } from "../../canvas/hooks/useCanvasContext";
import { useGlobalApp } from "../../app/hooks/useGlobalApp";

const getFontName = (fontSize: number) => {
    const ceiledFontSize = Math.ceil(fontSize);
    const FONT_FAMILY_NAME = "Cousine";
    const MAX_FONT_SIZE = 32;
    const MIN_FONT_SIZE = 6;
    if (ceiledFontSize < MIN_FONT_SIZE)
        return `${FONT_FAMILY_NAME} ${MIN_FONT_SIZE}`;

    if (ceiledFontSize >= MIN_FONT_SIZE && ceiledFontSize <= MAX_FONT_SIZE)
        return `${FONT_FAMILY_NAME} ${ceiledFontSize}`;

    return `${FONT_FAMILY_NAME} 64`;
};

type MarkingTextProps = Pick<
    InternalMarking,
    "id" | "size" | "position" | "textColor"
> & {
    visible: boolean;
};
function MarkingText({
    visible,
    id,
    size,
    position,
    textColor,
}: MarkingTextProps) {
    const text = id;
    const fontSize = Math.ceil(
        +((size * 2) / (text.length === 1 ? 1 : text.length * 0.58)).toFixed(0)
    );
    const fontName = getFontName(fontSize);

    return (
        <BitmapText
            key={id}
            visible={visible}
            text={text}
            x={position.x}
            y={position.y}
            anchor={[0.5, 0.43]}
            style={{
                fontSize,
                fontName,
                tint: textColor,
            }}
        />
    );
}

function isVisible(
    marking: InternalMarking,
    markingsLength: number,
    app: Application<ICanvas> | null,
    viewport: PixiViewport | null
): boolean {
    if (viewport === null || app === null) return false;
    const NONE = 0;
    const LOW = 200;
    const MEDIUM = 500;
    const HIGH = 900;
    const VERY_HIGH = 1200;

    const PRERENDER_MARGIN = (() => {
        switch (Global.settings.video.rendering.prerenderRadius) {
            case "auto":
                console.log(markingsLength);
                if (markingsLength < 100) return 2 * VERY_HIGH;
                if (markingsLength < 200) return VERY_HIGH;
                if (markingsLength < 500) return HIGH;
                if (markingsLength < 1000) return MEDIUM;
                return LOW;
            case "none":
                return NONE;
            case "low":
                return LOW;
            case "medium":
                return MEDIUM;
            case "high":
                return HIGH;
            case "very high":
                return VERY_HIGH;
            default:
                return HIGH;
        }
    })();

    const { x, y } = marking.position;

    if (x + viewport.x < app.screen.left - PRERENDER_MARGIN) return false;
    if (y + viewport.y < app.screen.top - PRERENDER_MARGIN) return false;
    if (x + viewport.x > app.screen.right + PRERENDER_MARGIN) return false;
    if (y + viewport.y > app.screen.bottom + PRERENDER_MARGIN) return false;

    return true;
}

export type MarkingsProps = {
    markings: InternalMarking[];
    canvasMetadata: CanvasMetadata;
};
export const Markings = memo(({ canvasMetadata, markings }: MarkingsProps) => {
    const viewport = useGlobalViewport(canvasMetadata.id);
    const app = useGlobalApp(canvasMetadata.id);

    const [renderableMarkings, setRenderableMarkings] = useState<
        RenderableMarking[]
    >([]);

    const updateRenderableMarkings = useCallback(() => {
        setRenderableMarkings(
            markings.map(marking => ({
                ...marking,
                visible: isVisible(marking, markings.length, app, viewport),
            }))
        );
    }, [markings, viewport, app]);

    useEffect(() => {
        viewport?.addEventListener("moved-end", updateRenderableMarkings);

        return () => {
            viewport?.removeEventListener(
                "moved-end",
                updateRenderableMarkings
            );
        };
    }, [updateRenderableMarkings, viewport]);

    useEffect(() => {
        setRenderableMarkings(
            markings.map(marking => ({
                ...marking,
                visible: isVisible(marking, markings.length, app, viewport),
            }))
        );
    }, [markings, viewport, app]);

    const draw = (g: PixiGraphics) => {
        // wyrenderuj wszystkie markingi jako jedna grafika dla lepszej wydajności
        g.clear();
        renderableMarkings.forEach(
            ({ visible, backgroundColor: color, position: { x, y }, size }) => {
                if (!visible) return;
                g.beginFill(color);
                g.drawCircle(x, y, size);
                g.endFill();
            }
        );
    };

    return (
        <>
            <Graphics draw={draw} />
            {renderableMarkings.map(
                ({ visible, id, size, position, textColor }) => {
                    return (
                        <MarkingText
                            visible={visible}
                            key={id}
                            id={id}
                            size={size}
                            position={position}
                            textColor={textColor}
                        />
                    );
                }
            )}
        </>
    );
});
