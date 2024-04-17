import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";
import { CanvasToolbarStore } from "@/lib/stores/CanvasToolbar";
import {
    Flag,
    FlagOff,
    MoveDiagonal,
    MoveHorizontal,
    MoveVertical,
    ImageUp,
    Save,
    FileInput,
} from "lucide-react";
import { ICON } from "@/lib/utils/const";
import { ToolbarGroup } from "@/components/toolbar/group";
import { Toggle } from "@/components/ui/toggle";
import { useTranslation } from "react-i18next";
import { loadImageWithDialog } from "@/lib/utils/viewport/loadImageWithDialog";
import { saveMarkingsDataWithDialog } from "@/lib/utils/viewport/saveMarkingsDataWithDialog";
import { loadMarkingsDataWithDialog } from "@/lib/utils/viewport/loadMarkingsDataWithDialog";
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
    const { t } = useTranslation();

    const { id } = useCanvasContext();
    const store = CanvasToolbarStore(id);

    const { markings } = store.use(state => state.settings);

    const { markings: markingsActions } = store.actions.settings;

    const { setShowLabels } = markingsActions;

    const viewport = useGlobalViewport(id, { autoUpdate: true });

    if (viewport === null) return null;

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
                    title={t("Load forensic mark image", { ns: "tooltip" })}
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        loadImageWithDialog(viewport);
                    }}
                >
                    <ImageUp size={ICON.SIZE} strokeWidth={ICON.STROKE_WIDTH} />
                </Toggle>
                <Toggle
                    title={t("Load markings data from file", {
                        ns: "tooltip",
                    })}
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        loadMarkingsDataWithDialog(viewport);
                    }}
                >
                    <FileInput
                        size={ICON.SIZE}
                        strokeWidth={ICON.STROKE_WIDTH}
                    />
                </Toggle>
                <Toggle
                    title={t("Save markings data to a JSON file", {
                        ns: "tooltip",
                    })}
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        saveMarkingsDataWithDialog(viewport);
                    }}
                >
                    <Save size={ICON.SIZE} strokeWidth={ICON.STROKE_WIDTH} />
                </Toggle>
            </ToolbarGroup>

            <ToolbarGroup>
                <Toggle
                    title={t("Fit world", { ns: "tooltip" })}
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        fitWorld(viewport);
                        emitFitEvents(viewport);
                    }}
                >
                    <MoveDiagonal
                        size={ICON.SIZE}
                        strokeWidth={ICON.STROKE_WIDTH}
                    />
                </Toggle>
                <Toggle
                    title={t("Fit height", { ns: "tooltip" })}
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        fitHeight(viewport);
                        emitFitEvents(viewport);
                    }}
                >
                    <MoveVertical
                        size={ICON.SIZE}
                        strokeWidth={ICON.STROKE_WIDTH}
                    />
                </Toggle>
                <Toggle
                    title={t("Fit width", { ns: "tooltip" })}
                    size="icon"
                    variant="outline"
                    pressed={false}
                    onClick={() => {
                        fitWidth(viewport);
                        emitFitEvents(viewport);
                    }}
                >
                    <MoveHorizontal
                        size={ICON.SIZE}
                        strokeWidth={ICON.STROKE_WIDTH}
                    />
                </Toggle>
            </ToolbarGroup>

            <ToolbarGroup>
                <Toggle
                    variant="outline"
                    title={t("Toggle marking labels", {
                        ns: "tooltip",
                    })}
                    size="icon"
                    pressed={markings.showLabels}
                    onClick={() => {
                        setShowLabels(!markings.showLabels);
                    }}
                >
                    {markings.showLabels ? (
                        <Flag
                            size={ICON.SIZE}
                            strokeWidth={ICON.STROKE_WIDTH}
                        />
                    ) : (
                        <FlagOff
                            size={ICON.SIZE}
                            strokeWidth={ICON.STROKE_WIDTH}
                        />
                    )}
                </Toggle>
            </ToolbarGroup>
        </div>
    );
}
