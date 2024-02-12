import { HTMLAttributes } from "react";

export type MarkingsInfoProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
>;
export function MarkingsInfo({ ...props }: MarkingsInfoProps) {
    return (
        <div className="w-full h-full flex flex-col items-center" {...props}>
            <div>Markings info</div>
        </div>
    );
}
