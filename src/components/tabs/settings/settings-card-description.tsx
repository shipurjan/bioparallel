import { CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";

export type SettingsCardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export function SettingsCardDescription({
    className,
    ...props
}: SettingsCardDescriptionProps) {
    return (
        <CardDescription
            {...props}
            className={cn(" max-w-prose pb-1.5", className)}
        />
    );
}
