/* eslint-disable no-param-reassign */
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";
import {
    LockClosedIcon,
    LockOpen1Icon,
    DimensionsIcon,
} from "@radix-ui/react-icons";
import { useGlobalToolbarStore } from "@/lib/stores/useToolbarStore";
import { produce } from "immer";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { ToolbarGroup } from "./group";

export type GlobalToolbarProps = HTMLAttributes<HTMLDivElement>;
export function GlobalToolbar({ className, ...props }: GlobalToolbarProps) {
    const { toolbarSettings, setToolbarSettings } = useGlobalToolbarStore(
        state => ({
            toolbarSettings: state.settings,
            setToolbarSettings: state.set,
        })
    );

    const { lockedViewport } = toolbarSettings;

    const toggleLockedViewport = () =>
        setToolbarSettings(
            produce(settings => {
                settings.lockedViewport.state = !settings.lockedViewport.state;
            })
        );

    const toggleLockScaleSync = () =>
        setToolbarSettings(
            produce(settings => {
                settings.lockedViewport.options.scaleSync =
                    !settings.lockedViewport.options.scaleSync;
            })
        );

    const o = toolbarSettings.lockedViewport.options;
    const lockedViewportToggleGroupValue = [
        ...(o.scaleSync ? ["scale_sync"] : []),
    ];

    return (
        <div
            className={cn(
                "flex items-center gap-2.5 justify-center w-fit h-fit p-2 rounded-md",
                className
            )}
            {...props}
        >
            <ToolbarGroup>
                <Toggle
                    variant="outline"
                    title="Lock viewports together"
                    size="sm"
                    pressed={lockedViewport.state}
                    onClick={toggleLockedViewport}
                >
                    {lockedViewport ? (
                        <LockClosedIcon className="h-4 w-4" />
                    ) : (
                        <LockOpen1Icon className="h-4 w-4" />
                    )}
                </Toggle>
                <ToggleGroup
                    type="multiple"
                    variant="outline"
                    size="sm"
                    value={lockedViewportToggleGroupValue}
                    disabled={!lockedViewport.state}
                >
                    <ToggleGroupItem
                        value="scale_sync"
                        title="Synchronize movement with viewport scale"
                        onClick={() => toggleLockScaleSync()}
                    >
                        <DimensionsIcon className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </ToolbarGroup>
        </div>
    );
}
