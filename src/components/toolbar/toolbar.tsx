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
import { useDebouncedCallback } from "use-debounce";
import { DashboardToolbar } from "@/lib/stores/DashboardToolbar";
import { ToolbarGroup } from "./group";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Input } from "../ui/input";

export type GlobalToolbarProps = HTMLAttributes<HTMLDivElement>;
export function GlobalToolbar({ className, ...props }: GlobalToolbarProps) {
    const { cursorMode, marking, viewport } = DashboardToolbar.use(
        state => state.settings
    );

    const { toggleLockedViewport, toggleLockScaleSync } =
        DashboardToolbar.actions.settings.viewport;
    const { setCursorMode } = DashboardToolbar.actions.settings.cursorMode;
    const { setMarkingSize } = DashboardToolbar.actions.settings.marking;

    const setMarkingBackgroundColor = useDebouncedCallback(
        value =>
            DashboardToolbar.actions.settings.marking.setMarkingBackgroundColor(
                value
            ),
        10
    );
    const setMarkingTextColor = useDebouncedCallback(
        value =>
            DashboardToolbar.actions.settings.marking.setMarkingTextColor(
                value
            ),
        10
    );

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
                        title="Select mode (1)"
                        onClick={() => {
                            setCursorMode("select");
                        }}
                    >
                        <CursorArrowIcon className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="marking"
                        title="Mark mode (2)"
                        onClick={() => {
                            setCursorMode("marking");
                        }}
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
                <Input
                    className="w-12 h-6 !p-0"
                    min={6}
                    max={32}
                    title="Marking size"
                    type="number"
                    value={marking.size}
                    onChange={e => {
                        setMarkingSize(e.target.valueAsNumber);
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
