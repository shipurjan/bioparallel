import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";
import { CanvasToolbarStore } from "@/lib/stores/CanvasToolbar";
import {
    Eye,
    Flag,
    FlagOff,
    MoveDiagonal,
    MoveHorizontal,
    MoveVertical,
    Waves,
} from "lucide-react";
import { ICON_SIZE, ICON_STROKE_WIDTH } from "@/lib/utils/const";
import { ToolbarGroup } from "@/components/toolbar/group";
import { Toggle } from "@/components/ui/toggle";
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

    const { texture, markings } = store.use(state => state.settings);

    const { texture: textureActions, markings: markingsActions } =
        store.actions.settings;

    const { setScaleMode } = textureActions;
    const { setShowLabels } = markingsActions;

    const viewport = useGlobalViewport(id, { autoUpdate: true });

    return (
        <div
            className={cn(
                "absolute flex items-center justify-center gap-2 top-0 left-1/2 -translate-x-1/2 w-fit h-fit bg-card/90 p-0.5 rounded-b-md",
                className
            )}
            {...props}
        >
            <ToolbarGroup>
                <Toggle
                    title="Fit world"
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        fitWorld(viewport);
                        emitFitEvents(viewport);
                    }}
                >
                    <MoveDiagonal
                        size={ICON_SIZE}
                        strokeWidth={ICON_STROKE_WIDTH}
                    />
                </Toggle>
                <Toggle
                    title="Fit height"
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        fitHeight(viewport);
                        emitFitEvents(viewport);
                    }}
                >
                    <MoveVertical
                        size={ICON_SIZE}
                        strokeWidth={ICON_STROKE_WIDTH}
                    />
                </Toggle>
                <Toggle
                    title="Fit width"
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        fitWidth(viewport);
                        emitFitEvents(viewport);
                    }}
                >
                    <MoveHorizontal
                        size={ICON_SIZE}
                        strokeWidth={ICON_STROKE_WIDTH}
                    />
                </Toggle>
            </ToolbarGroup>

            <ToolbarGroup>
                <Toggle
                    variant="outline"
                    title="Toggle scale mode"
                    size="icon"
                    pressed={texture.scaleMode === "linear"}
                    onClick={() => {
                        setScaleMode(
                            texture.scaleMode === "nearest"
                                ? "linear"
                                : "nearest"
                        );
                    }}
                >
                    {texture.scaleMode === "nearest" ? (
                        <Eye size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                    ) : (
                        <Waves
                            size={ICON_SIZE}
                            strokeWidth={ICON_STROKE_WIDTH}
                        />
                    )}
                </Toggle>
            </ToolbarGroup>

            <ToolbarGroup>
                <Toggle
                    variant="outline"
                    title="Show marking labels"
                    size="icon"
                    pressed={markings.showLabels}
                    onClick={() => {
                        setShowLabels(!markings.showLabels);
                    }}
                >
                    {markings.showLabels ? (
                        <Flag
                            size={ICON_SIZE}
                            strokeWidth={ICON_STROKE_WIDTH}
                        />
                    ) : (
                        <FlagOff
                            size={ICON_SIZE}
                            strokeWidth={ICON_STROKE_WIDTH}
                        />
                    )}
                </Toggle>
            </ToolbarGroup>
        </div>
    );
}
