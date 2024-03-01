/* eslint-disable no-param-reassign */
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";
import {
    LockClosedIcon,
    LockOpen1Icon,
    DimensionsIcon,
    CursorArrowIcon,
    Cross1Icon,
} from "@radix-ui/react-icons";
import { useGlobalToolbarStore } from "@/lib/stores/useToolbarStore";
import {
    enableMarkingCursorMode,
    enableSelectionCursorMode,
    toggleLockScaleSync,
    toggleLockedViewport,
} from "@/lib/utils/settings/toolbar-settings";
import { ToolbarGroup } from "./group";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export type GlobalToolbarProps = HTMLAttributes<HTMLDivElement>;
export function GlobalToolbar({ className, ...props }: GlobalToolbarProps) {
    const { toolbarSettings } = useGlobalToolbarStore(state => ({
        toolbarSettings: state.settings,
    }));

    const { lockedViewport, cursorMode } = toolbarSettings;

    return (
        <div
            className={cn(
                "flex items-center gap-2 py-0.5 justify-center w-fit h-fit rounded-md",
                className
            )}
            {...props}
        >
            <ToolbarGroup>
                <ToggleGroup
                    type="single"
                    value={cursorMode.state}
                    variant="outline"
                    size="icon"
                >
                    <ToggleGroupItem
                        value="select"
                        title="Select (1)"
                        onClick={enableSelectionCursorMode}
                    >
                        <CursorArrowIcon className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="marking"
                        title="Mark (2)"
                        onClick={enableMarkingCursorMode}
                    >
                        <Cross1Icon className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </ToolbarGroup>
            <ToolbarGroup>
                <Toggle
                    variant="outline"
                    title="Lock viewports together (L)"
                    size="icon"
                    pressed={lockedViewport.state}
                    onClick={toggleLockedViewport}
                >
                    {lockedViewport ? (
                        <LockClosedIcon className="h-4 w-4" />
                    ) : (
                        <LockOpen1Icon className="h-4 w-4" />
                    )}
                </Toggle>

                <Toggle
                    variant="outline"
                    title="Synchronize movement with viewport scale (M)"
                    size="icon"
                    pressed={lockedViewport.options.scaleSync}
                    onClick={toggleLockScaleSync}
                >
                    <DimensionsIcon className="h-4 w-4" />
                </Toggle>
            </ToolbarGroup>
        </div>
    );
}
