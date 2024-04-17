import { HTMLAttributes, useCallback, useState } from "react";
import { Canvas } from "./canvas";
import { CanvasToolbar } from "./canvas-toolbar";

export type CanvasContainerProps = HTMLAttributes<HTMLDivElement>;
export function CanvasContainer({ ...props }: CanvasContainerProps) {
    const [divSize, setDivSize] = useState({ width: 0, height: 0 });

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

    return (
        <div className="w-full h-full relative" ref={divRef} {...props}>
            <CanvasToolbar />
            <Canvas
                aria-label="canvas"
                width={divSize.width}
                height={divSize.height}
            />
        </div>
    );
}
