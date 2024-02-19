import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useGlobalToolbarStore } from "@/lib/stores/useToolbarStore";

export type GlobalToolbarProps = HTMLAttributes<HTMLDivElement>;
export function GlobalToolbar({ className, ...props }: GlobalToolbarProps) {
    const { lockedViewport, toggleLockedViewport: setLockedViewport } =
        useGlobalToolbarStore(state => ({
            lockedViewport: state.settings.lockedViewport,
            toggleLockedViewport: () =>
                state.set(settings => ({
                    ...settings,
                    lockedViewport: !settings.lockedViewport,
                })),
        }));

    return (
        <div
            className={cn(
                "flex items-center gap-2.5 justify-center w-fit h-fit p-2 rounded-md",
                className
            )}
            {...props}
        >
            <Toggle
                variant="outline"
                size="sm"
                pressed={lockedViewport}
                onClick={() => setLockedViewport()}
            >
                {lockedViewport ? (
                    <LockClosedIcon className="h-4 w-4" />
                ) : (
                    <LockOpen1Icon className="h-4 w-4" />
                )}
            </Toggle>
        </div>
    );
}
