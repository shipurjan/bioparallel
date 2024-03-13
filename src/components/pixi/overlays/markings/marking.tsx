import { InternalMarking } from "@/lib/stores/Markings";
import { BitmapText, Graphics } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { memo, useCallback } from "react";
import { drawMarking, getFontName } from "./marking.utils";

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

    const draw = useCallback(
        (g: PixiGraphics) => {
            g.clear();
            g.removeChildren();
            drawMarking(g, renderableMarking, 0.75);
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
