import { HTMLAttributes, useCallback, useState } from "react";
import { getDroppedFileData } from "@/lib/utils/canvas/get-dropped-file-data";
import { useCanvasContext } from "@/components/pixi/canvas/hooks/useCanvasContext";
import { loadSprite } from "@/lib/utils/viewport/load-sprite";
import { normalizeSpriteSize } from "@/lib/utils/viewport/normalize-sprite-size";
import { Canvas } from "./canvas";
import { useGlobalViewport } from "../viewport/hooks/useGlobalViewport";

export type CanvasContainerProps = HTMLAttributes<HTMLDivElement>;
export function CanvasContainer({ ...props }: CanvasContainerProps) {
    const [divSize, setDivSize] = useState({ width: 0, height: 0 });
    const { id } = useCanvasContext();
    const viewport = useGlobalViewport(id);

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
        <div
            className="w-full h-full cursor-default active:cursor-move"
            ref={divRef}
            onDragEnter={e => {
                e.preventDefault();
            }}
            onDragLeave={e => {
                e.preventDefault();
            }}
            onDrop={e => {
                e.preventDefault();
                getDroppedFileData(e)
                    .then(data => {
                        data.forEach(file => {
                            loadSprite(file)
                                .then(sprite => {
                                    viewport?.addChild(
                                        normalizeSpriteSize(viewport, sprite)
                                    );
                                })
                                .catch(console.error);
                        });
                    })
                    .catch(console.error);
            }}
            {...props}
        >
            <Canvas
                aria-label="canvas"
                width={divSize.width}
                height={divSize.height}
            />
        </div>
    );
}
