import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";

export type CanvasToolbarProps = HTMLAttributes<HTMLDivElement>;
export function CanvasToolbar({ className, ...props }: CanvasToolbarProps) {
    return (
        <div
            className={cn(
                "absolute flex gap-2 top-0 left-1/2 -translate-x-1/2 w-fit h-fit bg-card/75 p-2 rounded-b-md",
                className
            )}
            {...props}
        >
            <ToggleGroup type="single" variant="outline" size="sm">
                <ToggleGroupItem value="a">A</ToggleGroupItem>
                <ToggleGroupItem value="b">B</ToggleGroupItem>
                <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}
