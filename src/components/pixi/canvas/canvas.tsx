"use client";

import { Graphics } from "@pixi/react";
import { Viewport } from "@/components/pixi/viewport/viewport";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback, useEffect, useState } from "react";
import { App } from "@/components/pixi/app/app";

export function Canvas() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [divSize, setDivSize] = useState({ width: 0, height: 0 });

    const viewportRef = useCallback((viewport: PixiViewport | null) => {
        if (!viewport) return;
        console.debug(viewport);
    }, []);

    const divRef = useCallback((node: HTMLDivElement | null) => {
        if (!node) return;

        const resizeObserver = new ResizeObserver(() => {
            setDivSize({
                width: node.clientWidth,
                height: node.clientHeight,
            });
        });
        resizeObserver.observe(node);
    }, []);

    const draw = useCallback((g: PixiGraphics) => {
        g.beginFill(0xffffff, 0.5);
        g.drawCircle(0, 0, 50);
        g.endFill();
    }, []);

    if (!isClient) return null;

    return (
        <div className="w-full h-full" ref={divRef}>
            <App width={divSize.width} height={divSize.height}>
                <Viewport ref={viewportRef}>
                    <Graphics draw={draw} />
                </Viewport>
            </App>
        </div>
    );
}
