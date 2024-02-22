import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { SizeIcon, HeightIcon, WidthIcon } from "@radix-ui/react-icons";
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
    const viewport = useGlobalViewport(id, { autoUpdate: true });
    return (
        <div
            className={cn(
                "absolute flex gap-2 top-0 left-1/2 -translate-x-1/2 w-fit h-fit bg-card/75 p-1 rounded-b-md",
                className
            )}
            {...props}
        >
            <Button
                size="icon"
                variant="outline"
                onClick={() => {
                    fitWorld(viewport);
                    emitFitEvents(viewport);
                }}
            >
                <SizeIcon className="h-4 w-4" />
            </Button>
            <Button
                size="icon"
                variant="outline"
                onClick={() => {
                    fitHeight(viewport);
                    emitFitEvents(viewport);
                }}
            >
                <HeightIcon className="h-4 w-4" />
            </Button>
            <Button
                size="icon"
                variant="outline"
                onClick={() => {
                    fitWidth(viewport);
                    emitFitEvents(viewport);
                }}
            >
                <WidthIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}
