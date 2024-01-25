import { HTMLAttributes } from "react";

export type DebugInfoProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;
export function DebugInfo({ ...props }: DebugInfoProps) {
    return (
        <div className="w-full h-full flex flex-col items-center" {...props}>
            <div>Debug info</div>
        </div>
    );
}
