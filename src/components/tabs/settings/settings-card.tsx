import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/shadcn";
import { HTMLAttributes } from "react";

export type SettingsCardProps = HTMLAttributes<HTMLDivElement> & {
    title: string;
};
export function SettingsCard({
    className,
    children,
    title,
    ...props
}: SettingsCardProps) {
    return (
        <Card {...props} className={cn("p-3 pt-0", className)}>
            <>
                <CardHeader className="space-y-0 p-0 py-2 flex justify-center items-center">
                    <CardTitle className=" text-xl font-extrabold">
                        {title}
                    </CardTitle>
                </CardHeader>
                {children}
            </>
        </Card>
    );
}
