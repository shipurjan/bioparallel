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
import { Toolbar, useGlobalToolbarStore } from "@/lib/stores/useToolbarStore";
import { useDebouncedCallback } from "use-debounce";
import { ToolbarGroup } from "./group";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Input } from "../ui/input";

export type GlobalToolbarProps = HTMLAttributes<HTMLDivElement>;
export function GlobalToolbar({ className, ...props }: GlobalToolbarProps) {
    const { cursorMode, marking, viewport } = useGlobalToolbarStore(
        state => state.settings
    );

    const enableSelectCursorMode = () => Toolbar.setCursorMode("select");
    const enableMarkingCursorMode = () => Toolbar.setCursorMode("marking");
    const setMarkingBackgroundColor = useDebouncedCallback(
        value => Toolbar.setMarkingBackgroundColor(value),
        10
    );
    const setMarkingTextColor = useDebouncedCallback(
        value => Toolbar.setMarkingTextColor(value),
        10
    );
    const { toggleLockedViewport } = Toolbar;
    const { toggleLockScaleSync } = Toolbar;

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
                        onClick={enableSelectCursorMode}
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
                <Input
                    className="w-6 h-6"
                    title="Marking background color"
                    type="color"
                    value={marking.backgroundColor}
                    onChange={e => {
                        setMarkingBackgroundColor(e.target.value);
                    }}
                />
                <Input
                    className="w-6 h-6"
                    title="Marking text color"
                    type="color"
                    value={marking.textColor}
                    onChange={e => {
                        setMarkingTextColor(e.target.value);
                    }}
                />
            </ToolbarGroup>
            <ToolbarGroup>
                <Toggle
                    variant="outline"
                    title="Lock viewports together (L)"
                    size="icon"
                    pressed={viewport.locked}
                    onClick={toggleLockedViewport}
                >
                    {viewport.locked ? (
                        <LockClosedIcon className="h-4 w-4" />
                    ) : (
                        <LockOpen1Icon className="h-4 w-4" />
                    )}
                </Toggle>

                <Toggle
                    variant="outline"
                    title="Synchronize movement with viewport scale (M)"
                    size="icon"
                    pressed={viewport.scaleSync}
                    onClick={toggleLockScaleSync}
                >
                    <DimensionsIcon className="h-4 w-4" />
                </Toggle>
            </ToolbarGroup>
        </div>
    );
}
