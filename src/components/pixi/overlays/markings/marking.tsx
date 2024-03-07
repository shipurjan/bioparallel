/* eslint-disable sonarjs/prefer-single-boolean-return */
/* eslint-disable react/prop-types */
import {
    InternalMarking,
    RenderableMarking,
} from "@/lib/stores/useMarkingsStore";
import { BitmapText, Graphics } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { memo, useCallback } from "react";

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

export type MarkingProps = {
    marking: InternalMarking;
};
export const Marking = memo(({ marking }: MarkingProps) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const renderableMarking = {
        ...marking,
        visible: true,
    };

    const drawMarking = (
        g: PixiGraphics,
        {
            visible,
            backgroundColor: color,
            position: { x, y },
            size,
        }: RenderableMarking
    ) => {
        if (!visible) return;
        g.beginFill(color);
        // eslint-disable-next-line no-param-reassign
        g.alpha = 0.5;
        g.drawCircle(x, y, size);
        g.endFill();
    };

    const draw = useCallback(
        (g: PixiGraphics) => {
            g.clear();
            drawMarking(g, renderableMarking);
        },
        [renderableMarking]
    );

    return (
        <>
            <Graphics draw={draw} />
            <MarkingText
                visible={renderableMarking.visible}
                key={renderableMarking.id}
                id={renderableMarking.id}
                size={renderableMarking.size}
                position={renderableMarking.position}
                textColor={renderableMarking.textColor}
            />
        </>
    );
});
