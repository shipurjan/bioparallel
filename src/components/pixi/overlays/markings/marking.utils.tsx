/* eslint-disable sonarjs/prefer-single-boolean-return */
/* eslint-disable no-param-reassign */
import { InternalMarking, RenderableMarking } from "@/lib/stores/Markings";
import {
    AlphaFilter,
    Application,
    ICanvas,
    Graphics as PixiGraphics,
} from "pixi.js";
import { Viewport as PixiViewport } from "pixi-viewport";
import { GlobalSettingsStore } from "@/lib/stores/GlobalSettings";

export const getFontName = (fontSize: number) => {
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

export function isVisible(
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
        switch (
            GlobalSettingsStore.state.settings.video.rendering.prerenderRadius
        ) {
            case "auto":
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

export const drawMarking = (
    g: PixiGraphics,
    {
        id,
        visible,
        backgroundColor,
        textColor,
        position: { x, y },
        size,
        type,
        angleRad,
    }: RenderableMarking,
    showMarkingLabels?: boolean,
    alpha: number = 1
) => {
    if (!visible) return;

    const lineWidth = 2;
    const lineLength = 4;
    const shadowWidth = 0.5;

    if (type === "ray") {
        const a = new PixiGraphics();

        a.pivot.set(x, y);
        a.rotation = angleRad;

        a.moveTo(x, y - 3 * shadowWidth);
        a.lineStyle(lineWidth + 3 * shadowWidth, textColor);
        a.lineTo(x, y + lineLength * size + 3 * shadowWidth);

        a.moveTo(x, y);
        a.lineStyle(lineWidth, backgroundColor);
        a.lineTo(x, y + lineLength * size);

        a.position.set(x, y);
        g.addChild(a);
    }

    const c = new PixiGraphics();
    if (showMarkingLabels) {
        c.lineStyle(shadowWidth, textColor);
        c.drawCircle(x, y, size);
        c.beginFill(backgroundColor);
        c.drawCircle(x, y, size - shadowWidth);
        c.endFill();
        g.addChild(c);
    }

    if (!showMarkingLabels) {
        c.lineStyle(shadowWidth, textColor);
        c.drawCircle(x, y, size);
        c.beginFill(backgroundColor);
        c.drawCircle(x, y, size - shadowWidth);
        c.endFill();
        c.beginHole();
        c.drawCircle(x, y, size - lineWidth - 1 - shadowWidth);
        c.endHole();
        c.drawCircle(x, y, size - lineWidth - 2 - shadowWidth);
        g.addChild(c);
    }

    g.accessibleTitle = `Marking ${id}`;
    g.filters = [];

    if (alpha !== 1) {
        g.filters.push(new AlphaFilter(alpha));
    }
};
