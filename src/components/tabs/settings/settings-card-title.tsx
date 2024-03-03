import { CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";

export type SettingsCardTitleProps = HTMLAttributes<HTMLParagraphElement>;
export function SettingsCardTitle({
    className,
    ...props
}: SettingsCardTitleProps) {
    return (
        <CardTitle {...props} className={cn("text-md font-bold", className)} />
    );
}
