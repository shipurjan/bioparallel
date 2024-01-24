import { Text, useTick } from "@pixi/react";
import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import { useState } from "react";

export type DebugLayerComponentProps = { viewport: Viewport };
export function DebugLayerComponent({
    viewport: externalViewport,
}: DebugLayerComponentProps) {
    const [viewport, setViewport] = useState(externalViewport);

    useTick(() => {
        setViewport(externalViewport);
    });

    const { position } = viewport;
    const { x, y } = position;

    return (
        <>
            <Text
                text={`${x} ${y}`}
                anchor={0.5}
                x={200}
                y={200}
                style={
                    new PIXI.TextStyle({
                        align: "center",
                        fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                        fontSize: 14,
                        fontWeight: "400",
                        fill: ["#ffffff", "#00ff99"], // gradient
                        stroke: "#01d27e",
                        strokeThickness: 5,
                        letterSpacing: 20,
                        dropShadow: true,
                        dropShadowColor: "#ccced2",
                        dropShadowBlur: 4,
                        dropShadowAngle: Math.PI / 6,
                        dropShadowDistance: 6,
                        wordWrap: true,
                        wordWrapWidth: 440,
                    })
                }
            />
            <Text text="Hello World" anchor={0.5} x={150} y={150} />
        </>
    );
}
