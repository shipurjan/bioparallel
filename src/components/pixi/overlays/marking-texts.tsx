/* eslint-disable react/prop-types */
import { InternalMarking } from "@/lib/stores/useMarkingsStore";
import { BitmapText } from "@pixi/react";
import { memo } from "react";

export type MarkingTextsProps = {
    markings: InternalMarking[];
};
export const MarkingTexts = memo(({ markings }: MarkingTextsProps) => {
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

    return markings.map(
        ({ size: markingSize, textColor: tint, id, position }) => {
            const text = id;
            const fontSize = Math.ceil(
                +(
                    (markingSize * 2) /
                    (text.length === 1 ? 1 : text.length * 0.58)
                ).toFixed(0)
            );
            const fontName = getFontName(fontSize);

            return (
                <BitmapText
                    key={id}
                    text={text}
                    x={position.x}
                    y={position.y}
                    anchor={[0.5, 0.43]}
                    style={{
                        fontSize,
                        fontName,
                        tint,
                    }}
                />
            );
        }
    );
});
