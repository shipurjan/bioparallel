"use client";

import { Graphics, Stage } from "@pixi/react";
import { Viewport } from "@/components/pixi/viewport/viewport";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useEffect, useState } from "react";

export function Canvas() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const draw = useCallback((g: PixiGraphics) => {
        g.beginFill(0xffffff, 0.5);
        g.drawCircle(0, 0, 50);
        g.endFill();
    }, []);

    if (!isClient) return null;

    if (typeof window === "undefined") return null;

    return (
        <Stage width={300} height={300}>
            <Viewport>
                <Graphics draw={draw} />
            </Viewport>
        </Stage>
    );
}
