import { HTMLAttributes, useCallback, useState } from "react";
import { App } from "../app/app";

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
        <div className="w-full h-full" ref={divRef} {...props}>
            <App width={divSize.width} height={divSize.height} />
        </div>
    );
}
