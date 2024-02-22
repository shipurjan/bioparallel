import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";

export type ToolbarGroupProps = HTMLAttributes<HTMLDivElement>;
export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
    return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}
