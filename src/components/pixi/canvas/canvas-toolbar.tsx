import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CanvasToolbarStore } from "@/lib/stores/CanvasToolbar";
import {
    Eye,
    MoveDiagonal,
    MoveHorizontal,
    MoveVertical,
    Waves,
} from "lucide-react";
import { ICON_SIZE, ICON_STROKE_WIDTH } from "@/lib/utils/const";
import { useGlobalViewport } from "../viewport/hooks/useGlobalViewport";
import { useCanvasContext } from "./hooks/useCanvasContext";
import {
    emitFitEvents,
    fitHeight,
    fitWidth,
    fitWorld,
} from "./utils/fit-viewport";

export type CanvasToolbarProps = HTMLAttributes<HTMLDivElement>;
export function CanvasToolbar({ className, ...props }: CanvasToolbarProps) {
    const { id } = useCanvasContext();
    const store = CanvasToolbarStore(id);

    const { texture } = store.use(state => state.settings);

    useEffect(() => {
        console.log(texture.scaleMode);
    }, [texture.scaleMode]);

    const { texture: textureActions } = store.actions.settings;

    const { setScaleMode } = textureActions;

    const viewport = useGlobalViewport(id, { autoUpdate: true });

    return (
        <div
            className={cn(
                "absolute flex gap-0.5 top-0 left-1/2 -translate-x-1/2 w-fit h-fit bg-card/75 p-1 rounded-b-md",
                className
            )}
            {...props}
        >
            <Button
                title="Fit world"
                size="icon"
                variant="outline"
                onClick={() => {
                    fitWorld(viewport);
                    emitFitEvents(viewport);
                }}
            >
                <MoveDiagonal
                    size={ICON_SIZE}
                    strokeWidth={ICON_STROKE_WIDTH}
                />
            </Button>
            <Button
                title="Fit height"
                size="icon"
                variant="outline"
                onClick={() => {
                    fitHeight(viewport);
                    emitFitEvents(viewport);
                }}
            >
                <MoveVertical
                    size={ICON_SIZE}
                    strokeWidth={ICON_STROKE_WIDTH}
                />
            </Button>
            <Button
                title="Fit width"
                size="icon"
                variant="outline"
                onClick={() => {
                    fitWidth(viewport);
                    emitFitEvents(viewport);
                }}
            >
                <MoveHorizontal
                    size={ICON_SIZE}
                    strokeWidth={ICON_STROKE_WIDTH}
                />
            </Button>
            <Button
                title="Set scale mode"
                size="icon"
                variant="outline"
                onClick={() => {
                    setScaleMode(
                        texture.scaleMode === "nearest" ? "linear" : "nearest"
                    );
                }}
            >
                {texture.scaleMode === "nearest" ? (
                    <Eye size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                ) : (
                    <Waves size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                )}
            </Button>
        </div>
    );
}
